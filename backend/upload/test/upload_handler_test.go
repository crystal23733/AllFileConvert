package test

import (
	"bytes"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"

	"upload/config"
	"upload/controller"
	"upload/model"

	"github.com/gin-gonic/gin"
)

func TestUploadEndpoint(t *testing.T) {
	db := config.ConnectDB()
	_ = db.AutoMigrate(&model.File{})

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/upload", controller.UploadHandler(db))

	body := &bytes.Buffer{}
	w := multipart.NewWriter(body)
	fw, _ := w.CreateFormFile("file", "hello.txt")
	fw.Write([]byte("hi"))
	w.Close()

	req := httptest.NewRequest(http.MethodPost, "/upload", body)
	req.Header.Set("Content-Type", w.FormDataContentType())
	rec := httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("응답 코드 오류: %d", rec.Code)
	}
	if !bytes.Contains(rec.Body.Bytes(), []byte("file_id")) {
		t.Fatalf("file_id 키 없음")
	}
}
