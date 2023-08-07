import React, { useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

function Users() {
  const [status, setStatus] = useState(true);
  const getStudent = () => {
    axios
      .get("http://localhost:3000")
      .then((res) => {
        setStudent(
          res.data.user.sort((a, b) => {
            if (status == true) {
              return a.id - b.id;
            } else {
              return b.id - a.id;
            }
          })
        );
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getStudent();
  }, [status]);
  const [student, setStudent] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setErrorName("");
    setErrorDesc("");
    setShow(true);
  };
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => {
    setShow2(true);
    setErrorName("");
    setErrorDesc("");
  };
  const [newStudent, setNewStudent] = useState({});
  const [errorName, setErrorName] = useState("");
  const [errorDesc, setErrorDesc] = useState("");

  const handleUpdate = (id) => {
    handleShow2();
    axios
      .get(`http://localhost:3000/${id}`)
      .then((res) => setNewStudent(res.data))
      .catch((err) => console.log(err));
  };
  const handleSave = (id) => {
    setErrorName("");
    setErrorDesc("");
    if (!newStudent.name) {
      setErrorName("Không được để trống name");
    }
    if (!newStudent.description) {
      setErrorDesc("Không được để trống description");
    }
    if (newStudent.name && newStudent.description) {
      if (newStudent.id == id) {
        axios
          .put(`http://localhost:3000/${id}`, newStudent)
          .then((res) => {
            alert("Update Successfully");
            getStudent();
            setNewStudent({ name: "", description: "" });
            handleClose2();
          })
          .catch((err) => console.log(err));
      } else {
        alert("student not found");
      }
    }
  };
  const handleChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });
  };
  const handleAdd = () => {
    setErrorName("");
    setErrorDesc("");
    if (!newStudent.name) {
      setErrorName("Không được để trống name");
    }
    if (!newStudent.description) {
      setErrorDesc("Không được để trống description");
    }
    if (newStudent.name && newStudent.description) {
      axios.post("http://localhost:3000", newStudent).then((res) => {
        handleClose();
        getStudent();
        setNewStudent({
          name: "",
          description: "",
        });
      });
    }
  };

  const handleDelete = (i) => {
    axios
      .delete(`http://localhost:3000/${student[i].id}`)
      .then((res) => {
        alert("Delete successfully");
        getStudent();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleAsc = () => {
    setStatus(true);
    getStudent();
  };
  const handleDesc = () => {
    setStatus(false);
    getStudent();
  };
  return (
    <div>
      <Button variant="success" onClick={handleShow}>
        Create Student
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create new a student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel
            controlId="floatingTextarea"
            label="Name"
            className="mb-3"
          >
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              name="name"
              onChange={handleChange}
            />
          </FloatingLabel>
          {errorName && <p style={{ color: "red" }}>{errorName}</p>}
          <FloatingLabel controlId="floatingTextarea2" label="Description">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: "100px" }}
              name="description"
              onChange={handleChange}
            />
          </FloatingLabel>
          {errorDesc && <p style={{ color: "red" }}>{errorDesc}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleAdd}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
      <Table striped bordered hover>
        <caption align="top" style={{ textAlign: "center" }}>
          <h1>Student List</h1>
        </caption>
        <thead>
          <tr>
            <th>
              ID &nbsp;
              {status ? (
                <i className="fa-solid fa-sort-down" onClick={handleDesc}></i>
              ) : (
                <i className="fa-solid fa-sort-up" onClick={handleAsc}></i>
              )}
            </th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {student.map((s, i) => (
            <tr key={i}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.description}</td>
              <td>
                <Button variant="primary" onClick={() => handleUpdate(s.id)}>
                  Update
                </Button>
                <Button variant="danger" onClick={() => handleDelete(i)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Update student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel
            controlId="floatingTextarea"
            label="Name"
            className="mb-3"
          >
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              name="name"
              onChange={handleChange}
              value={newStudent.name}
            />
          </FloatingLabel>
          {errorName && <p style={{ color: "red" }}>{errorName}</p>}
          <FloatingLabel controlId="floatingTextarea2" label="Description">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: "100px" }}
              name="description"
              onChange={handleChange}
              value={newStudent.description}
            />
          </FloatingLabel>
          {errorDesc && <p style={{ color: "red" }}>{errorDesc}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => handleSave(newStudent.id)}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Users;
