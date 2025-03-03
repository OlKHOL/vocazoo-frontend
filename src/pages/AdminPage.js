import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import "../styles/AdminPage.css";
import Navigationbar from "../components/Navigationbar";
import { FaUpload, FaFileExcel, FaFileCsv, FaTrash } from "react-icons/fa";

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState("");

  // 관리자 권한 확인
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await api.get("/auth/check_admin");
        setIsAdmin(response.data.is_admin);
      } catch (error) {
        console.error("관리자 권한 확인 오류:", error);
        setIsAdmin(false);
        if (error.response?.status === 403) {
          setError("관리자 권한이 필요합니다.");
        } else {
          setError("관리자 권한 확인 중 오류가 발생했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // 파일 선택 처리
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".xlsx")) {
        setFile(file);
        setError("");
      } else {
        setError("CSV 또는 Excel 파일만 업로드 가능합니다.");
        setFile(null);
      }
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = async () => {
    if (!file) {
      setError("파일을 선택해주세요.");
      return;
    }

    if (!isAdmin) {
      setError("관리자 권한이 필요합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const response = await api.post("/admin/words/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadResult(response.data.message);
      setFile(null);
      setTimeout(() => {
        setShowUploadModal(false);
      }, 2000);
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      if (error.response?.status === 403) {
        setError("관리자 권한이 필요합니다.");
      } else {
        setError(
          error.response?.data?.error || "파일 업로드 중 오류가 발생했습니다."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page-wrapper">
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="text-center">
            <Spinner animation="border" />
            <p className="mt-3 text-muted">로딩 중...</p>
          </div>
        </Container>
        <Navigationbar />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-page-wrapper">
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <Alert variant="danger" className="text-center">
            <h4>관리자 권한이 필요합니다</h4>
            <p className="mb-0">
              이 페이지에 접근하려면 관리자 권한이 필요합니다.
            </p>
          </Alert>
        </Container>
        <Navigationbar />
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <Container className="admin-page py-4 mb-5">
        <h1 className="mb-4">관리자 페이지</h1>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>단어 파일 업로드</span>
            <Button
              variant="success"
              onClick={() => setShowUploadModal(true)}
              size="sm"
            >
              <FaUpload className="me-1" />
              파일 업로드
            </Button>
          </Card.Header>
          <Card.Body>
            <div className="bg-light p-3 rounded">
              <p className="mb-0">
                CSV 또는 Excel 파일을 업로드하여 단어를 추가하거나 업데이트할 수
                있습니다. 파일에는 다음 열이 포함되어야 합니다:
              </p>
              <ul className="mt-2 mb-0">
                <li>english: 영어 단어</li>
                <li>korean: 한국어 의미</li>
                <li>level: 단어 레벨 (1-5)</li>
              </ul>
            </div>
          </Card.Body>
        </Card>

        {/* 파일 업로드 모달 */}
        <Modal
          show={showUploadModal}
          onHide={() => {
            setShowUploadModal(false);
            setFile(null);
            setUploadResult(null);
            setError("");
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>단어 파일 업로드</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="upload-area p-4 text-center border rounded"
              style={{
                borderStyle: "dashed",
                borderColor: "#6c63ff",
                backgroundColor: "#f8f9fa",
                cursor: "pointer",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const droppedFile = e.dataTransfer.files[0];
                if (
                  droppedFile &&
                  (droppedFile.type === "text/csv" ||
                    droppedFile.name.endsWith(".xlsx"))
                ) {
                  setFile(droppedFile);
                  setError("");
                } else {
                  setError("CSV 또는 Excel 파일만 업로드 가능합니다.");
                }
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                type="file"
                id="fileInput"
                accept=".csv,.xlsx"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <FaFileExcel
                className="mb-3"
                style={{ fontSize: "3rem", color: "#6c63ff" }}
              />
              <h5>파일을 드래그하거나 클릭하여 업로드</h5>
              <p className="text-muted mb-0">
                CSV 또는 Excel 파일을 지원합니다
              </p>
            </div>

            {file && (
              <div className="mt-3 p-3 bg-light rounded">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <FaFileCsv className="me-2" />
                    <span>{file.name}</span>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            {uploadResult && (
              <Alert
                variant={uploadResult.includes("성공") ? "success" : "danger"}
                className="mt-3"
              >
                <p className="mb-0">{uploadResult}</p>
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleFileUpload}
              disabled={!file}
            >
              업로드
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <Navigationbar />
    </div>
  );
};

export default AdminPage;
