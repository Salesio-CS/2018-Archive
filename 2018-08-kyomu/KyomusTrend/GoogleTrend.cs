using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace ConsoleApp1
{
    class GoogleTrend
    {
        public GoogleTrend(string name, string count)
        {
            this.Name = name;
            this.Count = count;
        }
        public string Name { get; }
        public string Count { get; }

        public int ParseCount()
        {
            int len = this.Count.Length;
            string unit = this.Count.Substring(this.Count.Length - 2, 1);
            string units = "千万億";
            int multi = units.IndexOf(unit) + 3;
            int unitNum = (int)Math.Pow(10.0, multi == 5 ? 8.0 : multi);

            int num = int.Parse(this.Count.Substring(0, this.Count.Length - 2));
            return num * unitNum;
        }
    }

    class MyParse
    {
        public static GoogleTrend[] GetGoogleTrends()
        {
            StreamReader sr = new StreamReader("json.txt", Encoding.GetEncoding("Shift_JIS"));
            string exe = sr.ReadToEnd();
            sr.Close();
            exe = System.Text.RegularExpressions.Regex.Unescape(exe);

            var str = JObject.Parse(exe).SelectToken("default.trendingSearchesDays").ToString();
            var query1 = JArray.Parse(str).SelectMany(trendingSearchesDays => trendingSearchesDays["trendingSearches"])
                .Select(trendingSearches => new GoogleTrend((string)trendingSearches["title"]["query"], (string)trendingSearches["formattedTraffic"]));
            return query1.ToArray();
        }

        public static GoogleTrend[] GetGoogleTrends2()
        {
            StreamReader sr = new StreamReader("json1.txt", Encoding.GetEncoding("Shift_JIS"));
            string exe = sr.ReadToEnd();
            sr.Close();
            exe = System.Text.RegularExpressions.Regex.Unescape(exe);

            var str = JObject.Parse(exe).SelectToken("default.trendingSearchesDays").ToString();
            var query1 = JArray.Parse(str).SelectMany(trendingSearchesDays => trendingSearchesDays["trendingSearches"])
                .Select(trendingSearches => new GoogleTrend((string)trendingSearches["title"]["query"], (string)trendingSearches["formattedTraffic"]));
            return query1.ToArray();
        }
    }
}