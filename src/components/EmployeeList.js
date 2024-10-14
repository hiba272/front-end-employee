import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    hire_date: '',
    document: null // Ajout du champ document
  });

  // Charger la liste des employés depuis l'API
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/employees/');
      setEmployees(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    }
  };

  // Soumission du formulaire pour Ajouter/Modifier un employé
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(); // Utilisation de FormData pour inclure un fichier

    // Ajouter les champs au FormData
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      if (editMode) {
        // Si on est en mode édition, on modifie l'employé
        await axios.put(`http://127.0.0.1:8000/api/employees/${selectedEmployee.id}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setEditMode(false);  // Quitter le mode édition
      } else {
        // Sinon, on ajoute un nouvel employé
        await axios.post('http://127.0.0.1:8000/api/employees/', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // Recharger la liste des employés après l'ajout ou la modification
      loadEmployees();
      // Réinitialiser le formulaire après soumission
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        hire_date: '',
        document: null
      });

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  // Fonction pour remplir le formulaire lors du clic sur "Modifier"
  const handleEdit = (employee) => {
    setEditMode(true);  // Passer en mode édition
    setSelectedEmployee(employee);  // Stocker l'employé à modifier
    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      hire_date: employee.hire_date,
      document: null // Il ne récupère pas le fichier déjà existant
    });
  };

  // Fonction pour supprimer un employé
  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet employé ?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/employees/${id}/`);
        loadEmployees();  // Recharger la liste après suppression
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des employés</h1>

      {/* Formulaire pour Ajouter/Modifier un employé */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">{editMode ? 'Modifier Employé' : 'Ajouter un Employé'}</h2>

        <div className="mb-4">
          <label htmlFor="first_name" className="block text-gray-700 text-sm font-bold mb-2">Prénom</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="last_name" className="block text-gray-700 text-sm font-bold mb-2">Nom</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Téléphone</label>
          <input
            id="phone"
            name="phone"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            
          />
        </div>

        <div className="mb-4">
          <label htmlFor="department" className="block text-gray-700 text-sm font-bold mb-2">Département</label>
          <input
            id="department"
            name="department"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="hire_date" className="block text-gray-700 text-sm font-bold mb-2">Date d'embauche</label>
          <input
            id="hire_date"
            name="hire_date"
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            value={formData.hire_date}
            onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="document" className="block text-gray-700 text-sm font-bold mb-2">Document</label>
          <input
            id="document"
            name="document"
            type="file"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            onChange={(e) => setFormData({ ...formData, document: e.target.files[0] })}
          />
        </div>

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {editMode ? 'Modifier' : 'Ajouter'}
        </button>
      </form>

      {/* Liste des employés */}
      <h2 className="text-xl font-semibold mb-4">Liste des employés</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Prénom</th>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Téléphone</th>
            <th className="py-2 px-4 border-b">Département</th>
            <th className="py-2 px-4 border-b">Date d'embauche</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">Aucun employé trouvé.</td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td className="py-2 px-4 border-b">{employee.first_name}</td>
                <td className="py-2 px-4 border-b">{employee.last_name}</td>
                <td className="py-2 px-4 border-b">{employee.email}</td>
                <td className="py-2 px-4 border-b">{employee.phone}</td>
                <td className="py-2 px-4 border-b">{employee.department}</td>
                <td className="py-2 px-4 border-b">{employee.hire_date}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
