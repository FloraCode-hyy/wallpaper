
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Windows.Foundation.Metadata;
using Windows.Storage;
using Windows.System.UserProfile;
using Windows.UI.Popups;
using Windows.UI.Xaml.Controls;
using System.Runtime.InteropServices;

namespace Bridge
{
    [AllowForWeb]
    public sealed class MyNativeClass
    {

        public async void NativeMethodAsync(string msg)
        {
            var url = msg;
            var filePath = DownloadImageAndSaveFile(url);
            StorageFile file = await StorageFile.GetFileFromPathAsync(filePath);
            MessageDialog msgbox = new MessageDialog("...");
            if (!UserProfilePersonalizationSettings.IsSupported())
            {
                msgbox.Content = "不支持更换";
                await msgbox.ShowAsync();
                return;
            }
            UserProfilePersonalizationSettings settings = UserProfilePersonalizationSettings.Current;
            bool b = await settings.TrySetWallpaperImageAsync(file);
            if (b)
            {
                msgbox.Content = "设置成功。";

            }
            else
            {
                msgbox.Content = "操作失败。";
            }

            await msgbox.ShowAsync();
            return;
        }

        public string DownloadImageAndSaveFile(string url)
        {
            using (var client = new WebClient())
            {
                //创建临时文件目录下的存储图片的绝对路径
                var filePath = Path.Combine(ApplicationData.Current.LocalFolder.Path, "wallpaper.jpg");
                //将图片下载到这个路径下
                client.DownloadFile(url, filePath);
                //返回当前图片路径
                return filePath;
            }
        }

        public string SearchPictureAsync(string title)
        {
            string url = "https://unsplash.com/napi/search?query=" + title + "&per_page=20&xp=";
            string res = GetHttpResponse(url, 6000);
            return res;
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
    }
}
