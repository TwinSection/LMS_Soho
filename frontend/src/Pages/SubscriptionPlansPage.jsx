import { useState } from 'react';
import { Container, Button, Modal, Table, Form } from 'react-bootstrap';

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState([
    { name: 'Temel Plan', price: '49.99', duration: 30 },
    { name: 'Profesyonel Plan', price: '99.99', duration: 60 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(null);

  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    duration: 30,
  });

  const [editPlan, setEditPlan] = useState({
    name: '',
    price: '',
    duration: 30,
  });

  const handleAddPlan = () => {
    setPlans([...plans, newPlan]);
    setNewPlan({ name: '', price: '', duration: 30 });
    setShowAddModal(false);
  };

  const handleEditPlan = (index) => {
    setSelectedPlanIndex(index);
    setEditPlan({ ...plans[index] });
    setShowEditModal(true);
  };

  const handleDeletePlan = (index) => {
    setSelectedPlanIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedPlans = plans.filter((_, index) => index !== selectedPlanIndex);
    setPlans(updatedPlans);
    setShowDeleteModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewPlanChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prev) => ({ ...prev, [name]: value }));
  };

  const isNewPlanFormValid = () => {
    return newPlan.name && newPlan.price && newPlan.duration;
  };

  const convertDurationToTimeUnits = (duration) => {
    const years = Math.floor(duration / 365);
    const months = Math.floor((duration % 365) / 30);
    const days = duration % 30;
    return { days, months, years };
  };

  const formatDurationForTable = (duration) => {
    const { days, months, years } = convertDurationToTimeUnits(duration);
    return `G: ${days}, A: ${months}, Y: ${years}`;
  };

  return (
    <>
      <Container className="content" style={{ marginTop: '80px' }}>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>Yeni Abonelik Planı Ekle</Button>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Plan Adı</th>
              <th>Fiyat</th>
              <th>Süre</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr key={index}>
                <td>{plan.name}</td>
                <td>{plan.price} ₺</td>
                <td>{formatDurationForTable(plan.duration)}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditPlan(index)}>Düzenle</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeletePlan(index)}>Sil</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Planı Düzenle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Plan Adı</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editPlan.name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Fiyat</Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  value={editPlan.price}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Süre (gün olarak)</Form.Label>
                <Form.Control
                  type="number"
                  name="duration"
                  value={editPlan.duration}
                  onChange={handleEditChange}
                />
                <small>
                  {convertDurationToTimeUnits(editPlan.duration).years} Yıl,
                  {convertDurationToTimeUnits(editPlan.duration).months} Ay,
                  {convertDurationToTimeUnits(editPlan.duration).days} Gün
                </small>
              </Form.Group>
              <Button variant="primary" onClick={() => {
                const updatedPlans = [...plans];
                updatedPlans[selectedPlanIndex] = editPlan;
                setPlans(updatedPlans);
                setShowEditModal(false);
              }}>Kaydet</Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedPlanIndex !== null && `${selectedPlanIndex}. planı silmek istediğinize emin misiniz?`}</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="danger" onClick={confirmDelete}>Evet</Button>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hayır</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Yeni Abonelik Planı Ekle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Plan Adı</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newPlan.name}
                  onChange={handleNewPlanChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Fiyat</Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  value={newPlan.price}
                  onChange={handleNewPlanChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Süre (gün olarak)</Form.Label>
                <Form.Control
                  type="number"
                  name="duration"
                  value={newPlan.duration}
                  onChange={handleNewPlanChange}
                />
                <small>
                  {convertDurationToTimeUnits(newPlan.duration).years} Yıl,
                  {convertDurationToTimeUnits(newPlan.duration).months} Ay,
                  {convertDurationToTimeUnits(newPlan.duration).days} Gün
                </small>
              </Form.Group>
              <Button
                variant="primary"
                onClick={handleAddPlan}
                disabled={!isNewPlanFormValid()}
              >Kaydet</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};
