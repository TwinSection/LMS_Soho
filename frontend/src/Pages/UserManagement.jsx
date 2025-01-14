import { useState } from 'react';
import { Button, Modal, Table, Form, InputGroup, FormControl } from 'react-bootstrap';

export default function UserManagement() {
  const [users, setUsers] = useState([
    { username: 'user1', name: 'Ahmet', surname: 'Yılmaz', email: 'ahmet.yilmaz@example.com', password: '123456', role: 'Admin' },
    { username: 'user2', name: 'Mehmet', surname: 'Kaya', email: 'mehmet.kaya@example.com', password: '123456', role: 'User' },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'User',
  });

  const handleEditUser = (index) => {
    setSelectedUserIndex(index);
    setShowEditModal(true);
  };

  const handleDeleteUser = (index) => {
    setSelectedUserIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedUsers = users.filter((_, index) => index !== selectedUserIndex);
    setUsers(updatedUsers);
    setShowDeleteModal(false);
  };

  const handleCloseEditModal = () => setShowEditModal(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleAddUser = () => {
    setUsers([...users, newUser]);
    setNewUser({ username: '', name: '', surname: '', email: '', password: '', role: 'User' });
    setShowAddModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[selectedUserIndex][name] = value;
      return updatedUsers;
    });
  };

  const handleRoleChange = (e) => {
    setNewUser({ ...newUser, role: e.target.value });
  };

  const isFormValid = () => {
    return newUser.username && newUser.firstName && newUser.lastName && newUser.email && newUser.password && newUser.role;
  };

  return (
    <>
    <Container className="content" style={{ marginTop: '80px' }}>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>Yeni Kullanıcı Ekle</Button>

      {/* Kullanıcılar Tablosu */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Kullanıcı Adı</th>
            <th>E-Mail</th>
            <th>Rol</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditUser(index)}>Düzenle</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteUser(index)}>Sil</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Düzenle Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUserIndex !== null && `${selectedUserIndex}. Kullanıcı`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUserIndex !== null && (
            <Form>
              <Form.Group>
                <Form.Label>Kullanıcı Adı</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={users[selectedUserIndex].username}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Ad</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={users[selectedUserIndex].name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Soyad</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={users[selectedUserIndex].surname}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>E-Posta</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={users[selectedUserIndex].email}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Şifre</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={users[selectedUserIndex].password}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleCloseEditModal}>Düzenlemeyi Kaydet</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Silme Onayı Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUserIndex !== null && `${selectedUserIndex}. kullanıcıyı silmek istediğinize emin misiniz?`}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDelete}>Evet</Button>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>Hayır</Button>
        </Modal.Footer>
      </Modal>

      {/* Yeni Kullanıcı Ekle Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Kullanıcı Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Kullanıcı Adı</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                value={newUser.surname}
                onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>E-Posta</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rol</Form.Label>
              <Form.Control as="select" value={newUser.role} onChange={handleRoleChange}>
                <option value="Admin">Admin</option>
                <option value="User">Kullanıcı</option>
                <option value="Trainer">Eğitmen</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAddUser} disabled={!isFormValid()}>Kullanıcıyı Kaydet</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
    </>
  );
};