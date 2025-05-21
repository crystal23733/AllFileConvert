package util

import "os"

// FileExists는 지정한 경로에 파일이 존재하는지 확인합니다.
func FileExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && !info.IsDir()
}
