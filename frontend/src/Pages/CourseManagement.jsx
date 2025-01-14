import { useState } from 'react';
import { Container, Button, Modal, Table, Form } from 'react-bootstrap';

export default function CourseManagementPage(){
  const [courses, setCourses] = useState([
    { title: 'React Kursu', category: 'Frontend', instructor: 'Ahmet Yılmaz', createdAt: '2024-01-15' },
    { title: 'JavaScript Temelleri', category: 'Frontend', instructor: 'Mehmet Kaya', createdAt: '2024-02-10' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    instructor: 'Ahmet Yılmaz',
  });
  const [editCourse, setEditCourse] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    instructor: 'Ahmet Yılmaz',
  });

  const handleAddCourse = () => {
    setCourses([...courses, { ...newCourse, createdAt: new Date().toISOString().split('T')[0] }]);
    setNewCourse({ title: '', description: '', category: 'Frontend', instructor: 'Ahmet Yılmaz' });
    setShowAddModal(false);
  };

  const handleEditCourse = (index) => {
    setSelectedCourseIndex(index);
    setEditCourse({ ...courses[index] });
    setShowEditModal(true);
  };

  const handleDeleteCourse = (index) => {
    setSelectedCourseIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedCourses = courses.filter((_, index) => index !== selectedCourseIndex);
    setCourses(updatedCourses);
    setShowDeleteModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const isNewCourseFormValid = () => {
    return newCourse.title && newCourse.description && newCourse.category && newCourse.instructor;
  };

  return (
    <>
    <Container className="content" style={{ marginTop: '80px' }}>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>Yeni Kurs Ekle</Button>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Kurs Adı</th>
            <th>Kategori</th>
            <th>Eğitmen</th>
            <th>Oluşturulma Tarihi</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>{course.title}</td>
              <td>{course.category}</td>
              <td>{course.instructor}</td>
              <td>{course.createdAt}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditCourse(index)}>Düzenle</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteCourse(index)}>Sil</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Kursu Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Kurs Adı</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editCourse.title}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Kurs Açıklaması</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editCourse.description}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Kategori</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={editCourse.category}
                onChange={handleEditChange}
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Eğitmen</Form.Label>
              <Form.Control
                as="select"
                name="instructor"
                value={editCourse.instructor}
                onChange={handleEditChange}
              >
                <option value="Ahmet Yılmaz">Ahmet Yılmaz</option>
                <option value="Mehmet Kaya">Mehmet Kaya</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={() => {
              const updatedCourses = [...courses];
              updatedCourses[selectedCourseIndex] = editCourse;
              setCourses(updatedCourses);
              setShowEditModal(false);
            }}>Kaydet</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCourseIndex !== null && `${selectedCourseIndex}. kursu silmek istediğinize emin misiniz?`}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDelete}>Evet</Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hayır</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Kurs Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Kurs Adı</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newCourse.title}
                onChange={handleNewCourseChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Kurs Açıklaması</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newCourse.description}
                onChange={handleNewCourseChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Kategori</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={newCourse.category}
                onChange={handleNewCourseChange}
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Eğitmen</Form.Label>
              <Form.Control
                as="select"
                name="instructor"
                value={newCourse.instructor}
                onChange={handleNewCourseChange}
              >
                <option value="Ahmet Yılmaz">Ahmet Yılmaz</option>
                <option value="Mehmet Kaya">Mehmet Kaya</option>
              </Form.Control>
            </Form.Group>
            <Button 
              variant="primary" 
              onClick={handleAddCourse} 
              disabled={!isNewCourseFormValid()}>Kaydet</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
    </>
  );
};
