import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Pagination,
  Modal,
  Alert,
  Spinner,
  Nav,
  Badge,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import "../styles/AdminPage.css";
import Navigationbar from "../components/Navigationbar";
import {
  FaEdit,
  FaTrash,
  FaUpload,
  FaPlus,
  FaSearch,
  FaCog,
  FaFileExcel,
  FaFileCsv,
} from "react-icons/fa";

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editWord, setEditWord] = useState({
    id: null,
    english: "",
    korean: "",
    level: 1,
  });
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("words");

  // 관리자 권한 확인
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await api.get("/auth/check_admin");
        setIsAdmin(response.data.is_admin);
        if (response.data.is_admin) {
          fetchWords(1);
        }
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

  // 단어 목록 가져오기
  const fetchWords = async (page) => {
    setIsLoading(true);
    try {
      let url = `/admin/words?page=${page}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (selectedLevel) url += `&level=${selectedLevel}`;

      const response = await api.get(url);
      setWords(response.data.words);
      setTotalPages(response.data.pages);
      setCurrentPage(response.data.current_page);
    } catch (error) {
      console.error("단어 목록을 불러오는 중 오류가 발생했습니다:", error);
      setError("단어 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 처리
  const handleSearch = (e) => {
    e.preventDefault();
    fetchWords(1);
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    fetchWords(page);
  };

  // 단어 삭제
  const handleDeleteWord = async (wordId) => {
    if (window.confirm("이 단어를 삭제하시겠습니까?")) {
      try {
        await api.delete(`/admin/words/${wordId}`);
        fetchWords(currentPage);
      } catch (error) {
        console.error("단어 삭제 오류:", error);
        setError("단어 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 단어 수정 모달 열기
  const handleEditModalOpen = (word) => {
    setEditWord({
      id: word.id,
      english: word.english,
      korean: word.korean,
      level: word.level,
    });
    setShowEditModal(true);
  };

  // 단어 수정 저장
  const handleSaveEdit = async () => {
    try {
      await api.put(`/admin/words/${editWord.id}`, editWord);
      setShowEditModal(false);
      fetchWords(currentPage);
    } catch (error) {
      console.error("단어 수정 오류:", error);
      setError("단어 수정 중 오류가 발생했습니다.");
    }
  };

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
      fetchWords(currentPage);
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

  // 단어장 생성
  const handleCreateWordSet = async () => {
    try {
      const response = await api.post("/admin/word_sets");
      alert(`새 단어장이 생성되었습니다. ID: ${response.data.id}`);
    } catch (error) {
      console.error("단어장 생성 오류:", error);
      setError("단어장 생성 중 오류가 발생했습니다.");
    }
  };

  // 페이지네이션 컴포넌트
  const renderPagination = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
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
            <FaCog className="mb-2" style={{ fontSize: "2rem" }} />
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

        <Nav
          variant="tabs"
          className="mb-4"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
        >
          <Nav.Item>
            <Nav.Link eventKey="words">단어 관리</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="wordsets">단어장 관리</Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === "words" && (
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>단어 관리</span>
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
              <Form onSubmit={handleSearch} className="mb-4">
                <Row>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="검색어 입력..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                      <option value="">모든 레벨</option>
                      <option value="1">레벨 1</option>
                      <option value="2">레벨 2</option>
                      <option value="3">레벨 3</option>
                      <option value="4">레벨 4</option>
                      <option value="5">레벨 5</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Button type="submit" variant="primary" className="w-100">
                      검색
                    </Button>
                  </Col>
                </Row>
              </Form>

              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>영어</th>
                          <th>한국어</th>
                          <th>레벨</th>
                          <th>상태</th>
                          <th>작업</th>
                        </tr>
                      </thead>
                      <tbody>
                        {words.map((word) => (
                          <tr key={word.id}>
                            <td>{word.english}</td>
                            <td>{word.korean}</td>
                            <td>
                              <Badge
                                bg={
                                  word.level <= 2
                                    ? "success"
                                    : word.level <= 4
                                    ? "warning"
                                    : "danger"
                                }
                              >
                                레벨 {word.level}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={word.used ? "primary" : "secondary"}>
                                {word.used ? "사용됨" : "미사용"}
                              </Badge>
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditModalOpen(word)}
                                className="me-1"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteWord(word.id)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  {renderPagination()}
                </>
              )}
            </Card.Body>
          </Card>
        )}

        {activeTab === "wordsets" && (
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>단어장 관리</span>
              <Button variant="primary" onClick={handleCreateWordSet} size="sm">
                <FaPlus className="me-1" />새 단어장 생성
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="bg-light p-3 rounded">
                <p className="mb-0">
                  새 단어장을 생성하면 사용되지 않은 단어들 중에서 무작위로
                  30개를 선택하여 단어장을 만듭니다.
                </p>
              </div>
            </Card.Body>
          </Card>
        )}

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

        {/* 단어 수정 모달 */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>단어 수정</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>영어</Form.Label>
                <Form.Control
                  type="text"
                  value={editWord.english}
                  onChange={(e) =>
                    setEditWord({ ...editWord, english: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>한국어</Form.Label>
                <Form.Control
                  type="text"
                  value={editWord.korean}
                  onChange={(e) =>
                    setEditWord({ ...editWord, korean: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>레벨</Form.Label>
                <Form.Select
                  value={editWord.level}
                  onChange={(e) =>
                    setEditWord({
                      ...editWord,
                      level: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="1">레벨 1</option>
                  <option value="2">레벨 2</option>
                  <option value="3">레벨 3</option>
                  <option value="4">레벨 4</option>
                  <option value="5">레벨 5</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              저장
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <Navigationbar />
    </div>
  );
};

export default AdminPage;
