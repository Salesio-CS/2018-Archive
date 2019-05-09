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
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using ConsoleApp1;
using CoreTweet;
using FileIO;
using System.Threading;
using System.IO;

namespace KyomusTrend
{
    /// <summary>
    /// MainWindow.xaml の相互作用ロジック
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }
        private void Button_Click(object sender, EventArgs e)
        {
            Update1();
            TwitterTrend.Items.Clear();
            GoogleTrend.Items.Clear();
            var tokens = CoreTweet.Tokens.Create("nGO1UuGFhK30zESteMLtTDLVl"
    , "FsCvhHGRX8JcrmsTCNCiDg2rnqpUIRjA13SrM6yUZ3sJypTUjd"
    , "999471475198316544-PA8QuegyCCZCOtaR9vdigqmNfLQPxGV"
    , "w2AVjI2Fb0umXlbSpwrvOSSue3joK6jreA0A43gJqw8FL");

            var trendlist = tokens.Trends.Place(23424856);
            if (trendlist.Count >= 1)
            {
                Console.WriteLine(trendlist.Count);
            }
            foreach (var trendResult in trendlist)
            {
                foreach (var trend in trendResult.Trends)
                {
                    // Console.WriteLine(trend.Name);
                    // Console.WriteLine(trend.TweetVolume);
                    TwitterTrend.Items.Add(trend.Name);
                }
            }
            GoogleTrend[] googleTrends = MyParse.GetGoogleTrends();
            foreach (var googleTrend in googleTrends)
            {
                GoogleTrend.Items.Add(googleTrend.Name);
            }

            var selectionText = ModeSelect.SelectionBoxItem.ToString();

            if (selectionText == "1日前")
            {
                Update2();
                GoogleTrend_before.Items.Clear();
                GoogleTrend[] googleTrends2 = MyParse.GetGoogleTrends2();
                foreach (var googleTrend2 in googleTrends2)
                {
                    GoogleTrend_before.Items.Add(googleTrend2.Name);
                }
            }
            else if (selectionText == "2日前")
            {
                Update2();
                GoogleTrend_before.Items.Clear();
                GoogleTrend[] googleTrends2 = MyParse.GetGoogleTrends2();
                foreach (var googleTrend2 in googleTrends2)
                {
                    GoogleTrend_before.Items.Add(googleTrend2.Name);
                }
            }
            else if (selectionText == "3日前")
            {
                Update2();
                GoogleTrend_before.Items.Clear();
                GoogleTrend[] googleTrends2 = MyParse.GetGoogleTrends2();
                foreach (var googleTrend2 in googleTrends2)
                {
                    GoogleTrend_before.Items.Add(googleTrend2.Name);
                }
            }
            else if (selectionText == "4日前")
            {
                Update2();
                GoogleTrend_before.Items.Clear();
                GoogleTrend[] googleTrends2 = MyParse.GetGoogleTrends2();
                foreach (var googleTrend2 in googleTrends2)
                {
                    GoogleTrend_before.Items.Add(googleTrend2.Name);
                }
            }
            else if (selectionText == "5日前")
            {
                Update2();
                GoogleTrend_before.Items.Clear();
                GoogleTrend[] googleTrends2 = MyParse.GetGoogleTrends2();
                foreach (var googleTrend2 in googleTrends2)
                {
                    GoogleTrend_before.Items.Add(googleTrend2.Name);
                }
            }
            else if (selectionText == "6日前")
            {
                Update2();
                GoogleTrend_before.Items.Clear();
                GoogleTrend[] googleTrends2 = MyParse.GetGoogleTrends2();
                foreach (var googleTrend2 in googleTrends2)
                {
                    GoogleTrend_before.Items.Add(googleTrend2.Name);
                }
            }
            else if (selectionText == "7日前")
            {
                Update2();
                GoogleTrend_before.Items.Clear();
                GoogleTrend[] googleTrends2 = MyParse.GetGoogleTrends2();
                foreach (var googleTrend2 in googleTrends2)
                {
                    GoogleTrend_before.Items.Add(googleTrend2.Name);
                }
            }
        }

        private void Update1()
        {
            try
            {
                var wc = new System.Net.WebClient();
                wc.DownloadFile("https://trends.google.co.jp/trends/api/dailytrends?hl=ja&tz=-540&geo=JP&ns=15", @"temp.txt");
                wc.Dispose();

                List<string> json;

                var b = TextIO.ReadStrings("temp.txt", out json);

                File.Delete("temp.txt");

                if (b)
                {
                    json.RemoveAt(0);
                }
                File.Delete("json.txt");
                TextIO.WriteStrings("json.txt", json, false);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        private void Update2()
        {
            try
            {
                var selectionText = ModeSelect.SelectionBoxItem.ToString();
                DateTime dt = DateTime.Now;
                if (selectionText == "1日前")
                {
                    dt = dt.AddDays(-1);
                }
                else if (selectionText == "2日前")
                {
                    dt = dt.AddDays(-2);
                }
                else if (selectionText == "3日前")
                {
                    dt = dt.AddDays(-3);
                }
                else if (selectionText == "4日前")
                {
                    dt = dt.AddDays(-4);
                }
                else if (selectionText == "5日前")
                {
                    dt = dt.AddDays(-5);
                }
                else if (selectionText == "6日前")
                {
                    dt = dt.AddDays(-6);
                }
                else if (selectionText == "7日前")
                {
                    dt = dt.AddDays(-7);
                }
                var wc = new System.Net.WebClient();
                wc.DownloadFile("https://trends.google.com/trends/api/dailytrends?geo=JP&ed=" + dt.Year.ToString("D4") + dt.Month.ToString("D2") + dt.Day.ToString("D2"), @"temp1.txt");
                wc.Dispose();

                List<string> json;

                var b = TextIO.ReadStrings("temp1.txt", out json);

                File.Delete("temp1.txt");

                if (b)
                {
                    json.RemoveAt(0);
                }
                File.Delete("json1.txt");
                TextIO.WriteStrings("json1.txt", json, false);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        private void ListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {

        }

        private void ModeSelect_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {

        }

        private void ListBox_SelectionChanged_2(object sender, SelectionChangedEventArgs e)
        {

        }

        private void TextBox_TextChanged(object sender, TextChangedEventArgs e)
        {

        }
    }
}