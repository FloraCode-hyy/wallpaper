using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Newtonsoft.Json;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace App1
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        Bridge.MyNativeClass _bridge = new Bridge.MyNativeClass();

        public MainPage()
        {
            this.InitializeComponent();
        }

        private void webView3_NavigationStarting(WebView sender, WebViewNavigationStartingEventArgs args)
        {
            webView3.AddWebAllowedObject("nativeObject", _bridge);
        }
        public static string GetHttpResponse(string url, int Timeout)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.ContentType = "text/html;charset=UTF-8";
            request.UserAgent = null;
            request.Timeout = Timeout;

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream myResponseStream = response.GetResponseStream();
            StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.GetEncoding("utf-8"));
            string retString = myStreamReader.ReadToEnd();
            myStreamReader.Close();
            myResponseStream.Close();

            return retString;
        }

        private void webView3_LoadCompleted(object sender, NavigationEventArgs e)
        {
            string url = "https://unsplash.com/napi/search?query=popular&per_page=20&xp=";
            string res = GetHttpResponse(url, 6000);
            if (res != null)
            {
                 webView3.InvokeScriptAsync("appendImgFromWeb", new string[] { res });
            }
        }
    }
}