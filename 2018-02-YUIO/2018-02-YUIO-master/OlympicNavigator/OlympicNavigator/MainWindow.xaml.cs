using CefSharp.Wpf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Threading;
using System.Drawing;
using System.Drawing.Imaging;
using CefSharp;
using System.Device.Location;
using System.Diagnostics;
using System.Windows.Interop;
using System.Windows.Media;
using Image = System.Windows.Controls.Image;
using System.Runtime.InteropServices;
using Point = System.Drawing.Point;
using Brushes = System.Drawing.Brushes;

namespace OlympicNavigator
{
    /// <summary>
    /// MainWindow.xaml の相互作用ロジック
    /// </summary>
    public partial class MainWindow : Window
    {
        [DllImport("gdi32.dll", EntryPoint = "DeleteObject")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool DeleteObject([In] IntPtr hObject);

        Bitmap canvas;
        ChromiumWebBrowser browser = new ChromiumWebBrowser();
        bool debug = true;
        bool idle = false;
        bool useBmp = false;
        int[] windowSize = { 1264, 681 };
        Bitmap[] olympicVenueBitmap;
        Timer timer;
        OlympicVenue[] olympicVenues;
        OlympicVenueEnglishEdit[] olympicVenuesEnglishEdit;

        public MainWindow()
        {
            olympicVenues = OlympicAPI.GetOlympicVenues();
            olympicVenuesEnglishEdit = OlympicAPI.GetOlympicVenuesEnglish();
            InitializeComponent();
            olympicVenueBitmap = new Bitmap[olympicVenues.Length];

            for (var i = 0; i < olympicVenues.Length; i++)
            {
                olympicVenueBitmap[i] = new Bitmap(320, 320);
            }

            timer = new Timer(Callback, null, 1000, 1000);

            Task.Run(() =>
            {
                MapLoad();
            });
        }

        private void Callback(Object sender)
        {
            ImageUpdate(false, true);
        }

        /// <summary>
        /// デバッグ用の行番号取得メソッド
        /// </summary>
        /// <param name="lineNum"></param>
        /// <returns>呼び出したときの行番号</returns>
        static int GetCorrentLineNum([System.Runtime.CompilerServices.CallerLineNumber] int lineNum = 0)
        {
            return lineNum;
        }

        /// <summary>
        /// mapを読み込みます．
        /// </summary>
        private async void MapLoad()
        {
            idle = false;
            await Dispatcher.BeginInvoke((Action)(() =>
            {
                browser.Address = Environment.CurrentDirectory + "\\map.html";
                MapBrowser.Children.Add(browser);
            }));

            JavascriptResponse response;

            while (true)
            {
                if (browser.CanExecuteJavascriptInMainFrame)
                {
                    response = await browser.EvaluateScriptAsync("mapTest();");
                    if (response.Result != null && response.Result.ToString() == "true")
                    {
                        break;
                    }
                    Thread.Sleep(100);
                }
            }
            idle = true;

            UpdateVenuesIcon_Start();
            ImageUpdate(true, true);

        }

        /// <summary>
        /// 競技会場アイコンを自動更新します．
        /// </summary>
        private void UpdateVenuesIcon_Start()
        {
            var tasks = new Task[olympicVenues.Length];

            for (int i = 0; i < 41; i++)
            {
                var ii = i;
                tasks[ii] = Task.Factory.StartNew(() => CreateNewMark(1, ii));
            }

            Task.WaitAll(tasks);
            Task.Run(() =>
            {
                while (true)
                {
                    tasks = new Task[olympicVenues.Length];
                    for (int i = 0; i < 41; i++)
                    {
                        var ii = i;
                        tasks[ii] = Task.Factory.StartNew(() => CreateNewMark(1, ii));
                        Thread.Sleep(10);
                    }

                    Task.WaitAll(tasks);


                }

            });
        }


        private void ImageOnMap_MouseDown(object sender, MouseButtonEventArgs e)
        {

        }

        /// <summary>
        /// mapの上に重ねて表示する画像を更新します．
        /// </summary>
        private async void ImageUpdate(bool sizeChange, bool olympicVenuesIconChange)
        {
            try
            {
                if (!idle)
                {
                    return;
                }

                if (canvas == null)
                {
                    sizeChange = true;
                    canvas = new Bitmap(windowSize[0], windowSize[1]);
                }

                if (sizeChange)
                {
                    // ウィンドウサイズ変更直後はブラウザが応答しない時間があるため一時待機
                    idle = false;
                    Thread.Sleep(250);
                    idle = true;
                }

                var response = await browser.EvaluateScriptAsync("getLocation();");
                var jsResult = response.Result.ToString();
                if (jsResult == "")
                {
                    if (debug)
                    {
                        MessageBox.Show(GetCorrentLineNum() + ":jsResult がnullです．", "Error");
                    }
                    return;
                }

                // jsの戻り値をそれぞれの緯度,経度に変換
                var i = 0;
                var resultList = new List<string>();
                var delimiter = ",";
                // 画面上に表示されているmapの座標(中心,NorthEast(左上),SouthWest(右下))
                var mapLocations = new GeoCoordinate[3];

                try
                {
                    while (true)
                    {
                        if (jsResult.IndexOf(delimiter, i) == -1)
                        {
                            resultList.Add(jsResult.Substring(i, jsResult.Length - i));
                            break;
                        }
                        else
                        {
                            resultList.Add(jsResult.Substring(i, jsResult.IndexOf(delimiter, i) - i));
                        }
                        i = jsResult.IndexOf(delimiter, i) + delimiter.Length;
                    }
                }
                catch (Exception ex)
                {
                    if (debug)
                    {
                        MessageBox.Show(GetCorrentLineNum() + ":" + ex.Message, "Error");
                    }
                    return;
                }

                try
                {
                    var zoom = double.Parse(resultList[6]);
                    for (i = 0; i < 6; i += 2)
                    {
                        if (zoom > 5)
                        {
                            try
                            {
                                mapLocations[i / 2] = new GeoCoordinate(double.Parse(resultList[i]), double.Parse(resultList[i + 1]));
                            }
                            catch (ArgumentOutOfRangeException)
                            {
                                mapLocations[i / 2] = new GeoCoordinate(0, 0);
                            }
                        }
                        else
                        {
                            Dispatcher.BeginInvoke((Action)(() =>
                            {
                                ImageOnMap.Source = null;
                            }));
                            return;
                        }
                    }
                }
                catch (Exception ex)
                {
                    if (debug)
                    {
                        MessageBox.Show(GetCorrentLineNum() + ":" + ex.Message, "Error");
                    }
                    return;
                }

                // ここからBitmapロック
                i = 0;
                if (!useBmp)
                {
                    useBmp = true;
                }
                else
                {
                    // ウィンドウサイズが変更されたら強制実行，それ以外はビジー状態のときはスルー
                    if (!sizeChange)
                        return;
                }

                lock (canvas)
                {

                    if (sizeChange)
                    {
                        canvas = new Bitmap(windowSize[0], windowSize[1]);
                    }

                    Graphics graphics = null;

                    try
                    {
                        graphics = Graphics.FromImage(canvas);
                    }
                    catch (InvalidOperationException)
                    {
                        return;
                    }
                    graphics.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceCopy;

                    if (!sizeChange)
                    {
                        graphics.FillRectangle(new SolidBrush(System.Drawing.Color.FromArgb(0, 0, 0, 255)), graphics.VisibleClipBounds);
                    }

                    graphics.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceOver;

                    if (olympicVenuesIconChange)
                    {

                    }

                    var validityVenues = new List<int>();
                    for (i = 0; i < olympicVenues.Length; i++)
                    {
                        if (IsWithinArea(olympicVenues[i].location, mapLocations[1], mapLocations[2]))
                        {
                            validityVenues.Add(i);
                        }
                    }

                    for (i = 0; i < validityVenues.Count; i++)
                    {
                        // 原点は左上
                        graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                        // アイコンのリサイズ指定
                        var iconSize = new int[] { 160, 160 };
                        var rect = new RectangleF((int)LongitudeToPixel(olympicVenues[validityVenues[i]].location, mapLocations[1], mapLocations[2]) - iconSize[0] / 2, (int)LatitudeToPixel(olympicVenues[validityVenues[i]].location, mapLocations[1], mapLocations[2]) - iconSize[1], iconSize[0], iconSize[1]);
                        lock (olympicVenueBitmap[validityVenues[i]])
                        {
                            graphics.DrawImage(olympicVenueBitmap[validityVenues[i]], rect);
                        }

                    }
                    var hBmp = canvas.GetHbitmap();

                    Dispatcher.BeginInvoke((Action)(() =>
                    {
                        ImageOnMap.Source = Imaging.CreateBitmapSourceFromHBitmap(hBmp, IntPtr.Zero, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());
                        DeleteObject(hBmp);
                    }));

                    graphics.Dispose();
                    useBmp = false;
                }
                // Bitmapロック解除

            }
            catch (NullReferenceException ex)
            {
                if (debug)
                {
                    MessageBox.Show("ImageUpdate() 内:" + ex.Message, "Error");
                }
                return;
            }
        }

        /// <summary>
        /// 指定された座標が指定された範囲内に存在するか確認します．
        /// </summary>
        /// <param name="target">目的の座標</param>
        /// <param name="northEast">範囲の北東端</param>
        /// <param name="southWest">範囲の南西端</param>
        /// <returns>存在の有無</returns>
        private bool IsWithinArea(GeoCoordinate target, GeoCoordinate northEast, GeoCoordinate southWest)
        {
            if ((target.Latitude > northEast.Latitude && target.Latitude < southWest.Latitude) || (target.Latitude < northEast.Latitude && target.Latitude > southWest.Latitude))
            {
                if ((target.Longitude > northEast.Longitude && target.Longitude < southWest.Longitude) || (target.Longitude < northEast.Longitude && target.Longitude > southWest.Longitude))
                {
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// 画面端とターゲットの緯度から画面上の座標を計算します．
        /// </summary>
        /// <param name="target">目的の座標</param>
        /// <param name="northEast">画面の北東端</param>
        /// <param name="southWest">画面の南西端</param>
        /// <returns>画面上でのy座標(左上原点)</returns>
        private double LatitudeToPixel(GeoCoordinate target, GeoCoordinate northEast, GeoCoordinate southWest)
        {
            // !!既知の不具合:指定された範囲が90と-90をまたぐとき正常な計算ができない

            // 1ピクセルあたりの緯度(y軸)
            var lppY = (northEast.Latitude - southWest.Latitude) / windowSize[1];
            var y = northEast.Latitude - target.Latitude;
            return y / lppY;
        }

        /// <summary>
        /// 画面端とターゲットの経度から画面上の座標を計算します．
        /// </summary>
        /// <param name="target">目的の座標</param>
        /// <param name="northEast">画面の北東端</param>
        /// <param name="southWest">画面の南西端</param>
        /// <returns>画面上でのx座標(左上原点)</returns>
        private double LongitudeToPixel(GeoCoordinate target, GeoCoordinate northEast, GeoCoordinate southWest)
        {
            // !!既知の不具合:指定された範囲が180と-180をまたぐとき正常な計算ができない

            // 1ピクセルあたりの経度(x軸)
            var lppX = (northEast.Longitude - southWest.Longitude) / windowSize[0];
            var x = target.Longitude - southWest.Longitude;
            return x / lppX;
        }

        private void Window_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            windowSize[0] = (int)e.NewSize.Width - 16;
            windowSize[1] = (int)e.NewSize.Height - 39;

            Task.Run(() =>
            {
                Thread.Sleep(50);
                ImageUpdate(true, false);
            });
        }

        private void ImageOnMap_MouseMove(object sender, MouseEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                Task.Run(() =>
                {
                    ImageUpdate(false, false);
                });
            }
        }

        private void MapBrowser_PreviewMouseUp(object sender, MouseButtonEventArgs e)
        {
            Task.Run(() =>
            {
                for (int i = 0; i < 60; i++)
                {
                    Task.Run(() =>
                    {
                        ImageUpdate(false, false);
                    });
                    Thread.Sleep(16);
                }
            });
        }

        private void MapBrowser_PreviewMouseWheel(object sender, MouseWheelEventArgs e)
        {
            Task.Run(() =>
            {
                Thread.Sleep(100);
                ImageUpdate(false, false);
            });
        }

		/// <summary>
		/// 選択されている言語(true:Japanese,false:English)
		/// </summary>
		bool selectedLanguage = true;
        private void ChoiceLanguage_Click(object sender, RoutedEventArgs e)
        {
            selectedLanguage = !selectedLanguage;
			ImageUpdate(false, true);
		}

        /// <summary>
        /// 新しい競技会場のマークの画像を生成します．
        /// </summary>
        /// <param name="expansionRate">マークの展開率(0-1)</param>
        /// <param name="i">競技会場インデックス</param>
        private Task CreateNewMark(double expansionRate, int i)
        {
            start:
            try
            {
                var bitmap = new Bitmap(320, 320);

                var graphics = Graphics.FromImage(bitmap);
                graphics.FillRectangle(new SolidBrush(System.Drawing.Color.FromArgb(0, 0, 0, 255)), graphics.VisibleClipBounds);

                // 土台の楕円(276x46)
                graphics.FillEllipse(Brushes.LightBlue, 91, 274, 138, 46);

                // 傾けた四角形を描画．45度傾けたとき，横幅は298
                var destinationPoints = new Point[] {new Point(11, 149),
                            new Point(160, 0),
                            new Point(309, 149),
                            new Point(160, 298)};
                graphics.FillPolygon(Brushes.LightGreen, destinationPoints);

				// 会場名描画(MAX14字)(未選択:86,73～226,97 幅140)
				RectangleF rect;
                var fnt = new Font("MS UI Gothic", 16);
                var sf = new StringFormat
                {
                    Alignment = StringAlignment.Center,
                    LineAlignment = StringAlignment.Center
                };
                if (selectedLanguage)
                {
					rect = new RectangleF(86, 65, 140, 50);
					graphics.DrawString(olympicVenues[i].name, fnt, Brushes.Black, rect, sf);
                }
                else
                {
                    rect = new RectangleF(80, 55, 160, 60);
                    graphics.DrawString(olympicVenuesEnglishEdit[i].name, fnt, Brushes.Black, rect, sf);
                }
                fnt.Dispose();

                // 競技アイコン描画(96,104を原点に120,120に収まるように)
                Bitmap iconBitmap;
                switch (olympicVenues[i].gameType[0])
                {
                    case "開会式":
                        iconBitmap = Properties.Resources.nyujou;
                        break;
                    case "閉会式":
                        iconBitmap = Properties.Resources.heikai;
                        break;
                    case "卓球":
                        iconBitmap = Properties.Resources.tabletennis;
                        break;
                    case "ハンドボール":
                        iconBitmap = Properties.Resources.handball;
                        break;
                    case "陸上競技":
                        iconBitmap = Properties.Resources.rikujou;
                        break;
                    case "サッカー":
                        iconBitmap = Properties.Resources.soccer;
                        break;
                    case "柔道":
                        iconBitmap = Properties.Resources.judo;
                        break;
                    case "空手":
                        iconBitmap = Properties.Resources.karatei;
                        break;
                    case "ウエイトリフティング":
                        iconBitmap = Properties.Resources.weight_lifting;
                        break;
                    case "ボクシング":
                        iconBitmap = Properties.Resources.boxing;
                        break;
                    case "馬術":
                        iconBitmap = Properties.Resources.uma;
                        break;
                    case "バドミントン":
                        iconBitmap = Properties.Resources.badminton;
                        break;
                    case "近代五種":
                        iconBitmap = Properties.Resources.kindai_gosyumoku2;
                        break;
                    case "ラグビー":
                        iconBitmap = Properties.Resources.rugby;
                        break;
                    case "自転車競技":
                        iconBitmap = Properties.Resources.bicycle;
                        break;
                    case "バレーボール":
                        iconBitmap = Properties.Resources.volleyball;
                        break;
                    case "体操":
                        iconBitmap = Properties.Resources.gymnastics;
                        break;
                    case "テニス":
                        iconBitmap = Properties.Resources.tennis;
                        break;
                    case "水泳":
                        iconBitmap = Properties.Resources.suiei;
                        break;
                    case "トライアスロン":
                        iconBitmap = Properties.Resources.triathlon;
                        break;
                    case "バスケットボール":
                        iconBitmap = Properties.Resources.basketball;
                        break;
                    case "スポーツクライミング":
                        iconBitmap = Properties.Resources.rock_climbing;
                        break;
                    case "ホッケー":
                        iconBitmap = Properties.Resources.hockey;
                        break;
                    case "カヌー":
                        iconBitmap = Properties.Resources.canoe;
                        break;
                    case "アーチェリー":
                        iconBitmap = Properties.Resources.archery;
                        break;
                    case "テコンドー":
                        iconBitmap = Properties.Resources.taekwondo;
                        break;
                    case "レスリング":
                        iconBitmap = Properties.Resources.wrestling;
                        break;
                    case "フェンシング":
                        iconBitmap = Properties.Resources.fencing;
                        break;
                    case "サーフィン":
                        iconBitmap = Properties.Resources.surfing;
                        break;
                    case "射撃":
                        iconBitmap = Properties.Resources.shooting;
                        break;
                    case "ゴルフ":
                        iconBitmap = Properties.Resources.golf;
                        break;
                    case "セーリング":
                        iconBitmap = Properties.Resources.sailing;
                        break;
                    case "野球":
                        iconBitmap = Properties.Resources.baseball;
                        break;
                    case "ソフトボール":
                        iconBitmap = Properties.Resources.softball;
                        break;
                    default:
                        iconBitmap = Properties.Resources.nyujou;
                        Dispatcher.BeginInvoke((Action)(() =>
                        {
                            MessageBox.Show(GetCorrentLineNum() + ":競技アイコン画像が見つかりません．" + olympicVenues[i].gameType[0], "Error");
                        }));
                        break;
                }

                var aspectRatio = (double)iconBitmap.Width / iconBitmap.Height;
                if (aspectRatio > 1)
                {
                    rect = new RectangleF(96, (float)(104 + (120 - 120 / aspectRatio) / 2), 120, (float)(120 / aspectRatio));
                }
                else if (aspectRatio < 1)
                {
                    rect = new RectangleF((float)(96 + (120 - 120 * aspectRatio) / 2), 104, (float)(120 * aspectRatio), 120);
                }
                else
                {
                    rect = new RectangleF(96, 104, 120, 120);
                }

                graphics.DrawImage(iconBitmap, rect);

                // カウントダウン描画
                var startTime = new DateTime(2018, 11, 3, 0, 0, 0);
                var CurrentTime = DateTime.Now;
                var timeSpan = startTime - CurrentTime;

                rect = new RectangleF(86, 224, 140, 50);
                fnt = new Font("MS UI Gothic", 12);
                sf = new StringFormat
                {
                    Alignment = StringAlignment.Center,
                    LineAlignment = StringAlignment.Center
                };
                graphics.DrawString(timeSpan.ToString(@"dd\.hh\:mm\:ss"), fnt, Brushes.Black, rect, sf);
                fnt.Dispose();
                graphics.Dispose();

                lock (olympicVenueBitmap[i])
                {
                    olympicVenueBitmap[i] = bitmap;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("ImageUpdate() 内:" + ex.Message, "Error");
                goto start;
            }



            return null;
        }

    }
}