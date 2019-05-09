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
using Point = System.Drawing.Point;
using Brushes = System.Drawing.Brushes;
using System.Runtime.InteropServices;
using System.IO;

namespace OlympicNavigator
{

    /// <summary>
    /// 競技会場データ
    /// </summary>
    public struct OlympicVenue
    {
        /// <summary>
        /// 競技会場インデックス
        /// </summary>
        public int index { get; set; }

        /// <summary>
        /// 競技会場名
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 位置情報
        /// </summary>
        public GeoCoordinate location { get; set; }

        /// <summary>
        /// 行われる競技種目
        /// </summary>
        public string[] gameType { get; set; }

        /// <summary>
        /// 競技開始時間
        /// </summary>
        public DateTime[] gameStartTime { get; set; }

        /// <summary>
        /// 最寄り駅
        /// </summary>
        public string nearestStation { get; set; }
    }

    /// <summary>
    /// 競技会場データ(英語版)
    /// </summary>
    public struct OlympicVenueEnglishEdit
    {
        /// <summary>
		/// 競技会場インデックス
		/// </summary>
		public int index { get; set; }

        /// <summary>
        /// 競技会場名
        /// </summary>
        public string name { get; set; }
    }



    /// <summary>
    /// オリンピック関連API
    /// </summary>
    class OlympicAPI
    {
        /// <summary>
        /// すべての競技会場情報を取得します．
        /// </summary>
        /// <returns>競技会場データ</returns>
        public static OlympicVenue[] GetOlympicVenues()
        {
            var olympicVenuesList = OlympicVenuesList(",").ToArray();
            var venues = new OlympicVenue[olympicVenuesList.Length];

            for (var i = 0; i < olympicVenuesList.Length; i++)
            {
                venues[i].index = i;
                venues[i].name = olympicVenuesList[i][0];
                venues[i].location = new GeoCoordinate(double.Parse(olympicVenuesList[i][1]), double.Parse(olympicVenuesList[i][2]));
                venues[i].gameType = new string[olympicVenuesList[i].Count - 3];
                for (var j = 3; j < olympicVenuesList[i].Count; j++)
                {
                    venues[i].gameType[j - 3] = olympicVenuesList[i][j];
                }
            }

            return venues;
        }

        /// <summary>
        /// すべての競技会場名(英語)情報を取得します．
        /// </summary>
        /// <returns>競技会場名データ(英語)</returns>
        public static OlympicVenueEnglishEdit[] GetOlympicVenuesEnglish()
        {
            var olympicVenuesListEnglish = OlympicVenuesListEnglishEdit(",").ToArray();
            var venues = new OlympicVenueEnglishEdit[olympicVenuesListEnglish.Length];

            for (var i = 0; i < olympicVenuesListEnglish.Length; i++)
            {
                venues[i].index = i;
                venues[i].name = olympicVenuesListEnglish[i][0];
            }

            return venues;
        }


        /// <summary>
        /// csvファイルを読み込み，stringの2次元Listで返します．
        /// </summary>
        /// <param name="delimiter">区切り文字</param>
        /// <returns>ファイルの内容(ファイルが存在しない場合はnull)</returns>
        public static List<List<string>> OlympicVenuesList(string delimiter)
        {
            var olympicVenuesList = Properties.Resources.OlympicVenuesList.Split(new string[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);

            var list = new List<List<string>>();

            foreach (var line in olympicVenuesList)
            {
                list.Add(line.Split(new string[] { delimiter }, StringSplitOptions.RemoveEmptyEntries).ToList());
            }

            return list;
        }

        public static List<List<string>> OlympicVenuesListEnglishEdit
            (string delimiter)
        {
            var olympicVenuesListEnglishEdit = Properties.Resources.OlympicVenuesListEnglishEdit.Split(new string[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);

            var list = new List<List<string>>();

            foreach (var line in olympicVenuesListEnglishEdit)
            {
                list.Add(line.Split(new string[] { delimiter }, StringSplitOptions.RemoveEmptyEntries).ToList());
            }

            return list;
        }

    }
}
