package test

import (
	"bytes"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"upload/config"
	"upload/controller"
	"upload/model"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	_ = godotenv.Load("../.env")            // 환경변수 로드
	os.Setenv("UPLOAD_DIR", "test_uploads") // 테스트용 디렉터리
}

func TestUploadEndpoint(t *testing.T) {
	// 테스트용 업로드 디렉터리 생성 및 정리
	os.MkdirAll("test_uploads", 0755)
	defer os.RemoveAll("test_uploads")

	db := config.ConnectDB()
	_ = db.AutoMigrate(&model.File{})

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/upload", controller.UploadHandler(db))

	// 실제 파일 내용을 가진 multipart 폼 생성
	body := &bytes.Buffer{}
	w := multipart.NewWriter(body)
	fw, _ := w.CreateFormFile("file", "test.txt")
	fw.Write([]byte("hello world test content"))
	w.Close()

	req := httptest.NewRequest(http.MethodPost, "/upload", body)
	req.Header.Set("Content-Type", w.FormDataContentType())
	rec := httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("응답 코드 오류: 기대값 %d, 실제값 %d, 응답: %s",
			http.StatusOK, rec.Code, rec.Body.String())
	}
	if !bytes.Contains(rec.Body.Bytes(), []byte("file_id")) {
		t.Fatalf("file_id 키 없음. 응답: %s", rec.Body.String())
	}

	// DB에 파일 정보가 저장되었는지 확인
	var files []model.File
	db.Find(&files)
	if len(files) == 0 {
		t.Fatalf("DB에 파일 정보가 저장되지 않음")
	}
}
