import http.server
import socketserver
import socket
import webbrowser
import os

PORT = 8000

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)

def run():
    ip = get_local_ip()
    print("=" * 60)
    print("🏫 國立員林家商圖書館 - 密室逃脫系統伺服器已啟動！")
    print(f"📺 大螢幕/教師電腦開啟：http://localhost:{PORT}/teacher.html")
    print(f"📱 學生手機連線網址（同一Wi-Fi）：http://{ip}:{PORT}/student.html")
    print("=" * 60)

    webbrowser.open(f"http://localhost:{PORT}/teacher.html")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n伺服器已關閉。")

if __name__ == "__main__":
    run()
