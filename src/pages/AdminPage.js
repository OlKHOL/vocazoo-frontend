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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import "../styles/AdminPage.css";
import Navigationbar from "../components/Navigationbar";
import axios from "axios";

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
        const response = await api.get("/check_admin");
        setIsAdmin(response.data.is_admin);
        if (!response.data.is_admin) {
          navigate("/");
        } else {
          fetchWords(1);
        }
      } catch (error) {
        console.error("관리자 권한 확인 오류:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

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
      console.error("단어 목록 가져오기 오류:", error);
      setError("단어 목록을 가져오는 중 오류가 발생했습니다.");
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
    if (!window.confirm("정말로 이 단어를 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/admin/words/${wordId}`);
      fetchWords(currentPage);
    } catch (error) {
      console.error("단어 삭제 오류:", error);
      setError("단어 삭제 중 오류가 발생했습니다.");
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

  // 파일 업로드 처리
  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        setUploadResult("파일을 선택해주세요.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name);
      console.log("FormData contents:", Array.from(formData.entries()));

      const response = await axios.post("/admin/upload_words", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        validateStatus: function (status) {
          return status < 500; // 500 미만의 상태 코드는 에러로 처리하지 않음
        },
      });

      console.log("Upload response:", response);

      if (response.status === 200) {
        setUploadResult(
          `업로드 성공: ${response.data.added}개 추가, ${response.data.updated}개 수정됨`
        );
      } else {
        setUploadResult(
          `업로드 실패: ${
            response.data.error || "알 수 없는 오류가 발생했습니다."
          }`
        );
      }
    } catch (error) {
      console.error("File upload error:", error);
      console.error("Error response:", error.response);
      setUploadResult(
        `업로드 오류: ${error.response?.data?.error || error.message}`
      );
    }
  };

  // 단어장 생성
  const handleCreateWordSet = async () => {
    try {
      const response = await api.post("/admin/create_word_set");
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

  if (isLoading && !isAdmin) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <Container className="admin-page py-4 mb-5">
        <h1 className="mb-4 text-center">관리자 페이지</h1>

        {error && <Alert variant="danger">{error}</Alert>}

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
          <Nav.Item>
            <Nav.Link eventKey="tools">관리 도구</Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === "words" && (
          <Card className="mb-4">
            <Card.Header as="h5">단어 관리</Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form onSubmit={handleSearch}>
                    <Row>
                      <Col md={5}>
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
                      <Col md={4}>
                        <Button type="submit" variant="primary">
                          검색
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col md={6} className="text-end">
                  <Button
                    variant="success"
                    onClick={() => setShowUploadModal(true)}
                    className="me-2"
                  >
                    CSV 업로드
                  </Button>
                </Col>
              </Row>

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
                          <th>ID</th>
                          <th>영어</th>
                          <th>한국어</th>
                          <th>레벨</th>
                          <th>사용됨</th>
                          <th>마지막 수정</th>
                          <th>작업</th>
                        </tr>
                      </thead>
                      <tbody>
                        {words.map((word) => (
                          <tr key={word.id}>
                            <td>{word.id}</td>
                            <td>{word.english}</td>
                            <td>{word.korean}</td>
                            <td>{word.level}</td>
                            <td>{word.used ? "예" : "아니오"}</td>
                            <td>
                              {word.last_modified
                                ? new Date(
                                    word.last_modified
                                  ).toLocaleDateString()
                                : "-"}
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditModalOpen(word)}
                                className="me-1"
                              >
                                수정
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteWord(word.id)}
                              >
                                삭제
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
          <Card className="mb-4">
            <Card.Header as="h5">단어장 관리</Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <Button variant="primary" onClick={handleCreateWordSet}>
                    새 단어장 생성
                  </Button>
                </Col>
              </Row>
              <p>
                새 단어장을 생성하면 사용되지 않은 단어들 중에서 무작위로 30개를
                선택하여 단어장을 만듭니다. 생성된 단어장은 기본적으로 비활성화
                상태입니다.
              </p>
            </Card.Body>
          </Card>
        )}

        {activeTab === "tools" && (
          <Card className="mb-4">
            <Card.Header as="h5">관리 도구</Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <h6>관리자 권한 관리</h6>
                  <p>
                    관리자 권한을 부여하거나 박탈하려면 다음 명령어를
                    사용하세요:
                  </p>
                  <div className="bg-light p-3 rounded">
                    <code>
                      python backend/create_admin.py --username 사용자명
                    </code>
                    <br />
                    <code>
                      python backend/revoke_admin.py --username 사용자명
                    </code>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* 파일 업로드 모달 */}
        <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>CSV 파일 업로드</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleFileUpload}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>CSV 파일 선택</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  id="csvFileUpload"
                  name="file"
                  className="form-control"
                />
                <Form.Text className="text-muted">
                  CSV 파일은 english, korean, level 열을 포함해야 합니다.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                업로드
              </Button>
            </Form>

            {uploadResult && (
              <Alert variant="success" className="mt-3">
                <p>{uploadResult}</p>
              </Alert>
            )}
          </Modal.Body>
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
