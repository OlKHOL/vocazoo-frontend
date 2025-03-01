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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import "../styles/AdminPage.css";

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
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/admin/upload_words", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadResult(response.data);
      fetchWords(1);
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      setError(
        error.response?.data?.error || "파일 업로드 중 오류가 발생했습니다."
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
    <Container className="admin-page py-4">
      <h1 className="mb-4">관리자 페이지</h1>

      {error && <Alert variant="danger">{error}</Alert>}

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
                className="me-2"
                onClick={() => setShowUploadModal(true)}
              >
                CSV 업로드
              </Button>
              <Button variant="primary" onClick={handleCreateWordSet}>
                단어장 생성
              </Button>
            </Col>
          </Row>

          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Table striped bordered hover responsive>
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
                  {words.length > 0 ? (
                    words.map((word) => (
                      <tr key={word.id}>
                        <td>{word.id}</td>
                        <td>{word.english}</td>
                        <td>{word.korean}</td>
                        <td>{word.level}</td>
                        <td>{word.used ? "예" : "아니오"}</td>
                        <td>
                          {word.last_modified
                            ? new Date(word.last_modified).toLocaleString()
                            : "-"}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleEditModalOpen(word)}
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        단어가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {renderPagination()}
            </>
          )}
        </Card.Body>
      </Card>

      {/* 파일 업로드 모달 */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>CSV 파일 업로드</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            CSV 파일 형식: <code>english,korean,level</code>
          </p>
          <p>첫 번째 행은 헤더로 간주됩니다.</p>

          <Form onSubmit={handleFileUpload}>
            <Form.Group className="mb-3">
              <Form.Label>CSV 파일 선택</Form.Label>
              <Form.Control
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>

            {uploadResult && (
              <Alert variant="success">
                <p>업로드 완료!</p>
                <ul>
                  <li>추가된 단어: {uploadResult.added}</li>
                  <li>업데이트된 단어: {uploadResult.updated}</li>
                  <li>오류: {uploadResult.errors}</li>
                </ul>
                {uploadResult.error_details.length > 0 && (
                  <>
                    <p>오류 상세:</p>
                    <ul>
                      {uploadResult.error_details.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </>
                )}
              </Alert>
            )}

            <div className="text-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowUploadModal(false)}
              >
                닫기
              </Button>
              <Button variant="primary" type="submit">
                업로드
              </Button>
            </div>
          </Form>
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
                  setEditWord({ ...editWord, level: parseInt(e.target.value) })
                }
              >
                <option value={1}>레벨 1</option>
                <option value={2}>레벨 2</option>
                <option value={3}>레벨 3</option>
                <option value={4}>레벨 4</option>
                <option value={5}>레벨 5</option>
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
  );
};

export default AdminPage;
