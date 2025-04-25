import axios from 'axios';

// Crie uma instância do axios com a URL base da sua API
const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});
// Adiciona o token automaticamente em todas as requisições
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Função auxiliar para formatar o ID corretamente
const formatId = (id) => {
    // Se o ID for null ou undefined, retornar uma string vazia
    if (id == null) {
        return '';
    }

    // Converter para string primeiro
    let idStr = String(id);

    // Se o ID contiver ":", extrair apenas a parte numérica antes do ":"
    if (idStr.includes(':')) {
        idStr = idStr.split(':')[0];
    }

    return idStr;
};

// Função para formatar o objeto de funcionário para o formato esperado pelo backend
const formatEmployeeForUpdate = (employee) => {
    // Garantir que o ID da empresa e da posição sejam números inteiros
    const companyId = employee.companyId ? parseInt(employee.companyId) : null;
    const positionId = employee.positionId ? parseInt(employee.positionId) : null;

    // Garantir que o salário seja um número de ponto flutuante
    const salary = employee.salary ? parseFloat(employee.salary) : 0;

    // Criar o objeto no formato esperado pelo backend (UpdateEmployeeDto)
    return {
        name: employee.name || '',
        cpf: employee.cpf || '',
        status: employee.status !== undefined ? employee.status : true,
        photo: employee.photo || '',
        salary: salary,
        companyId: companyId,
        positionId: positionId
    };
};

// Exportando diretamente os métodos como objeto
export default {
    getAllEmployees() {
        return api.get('/api/employees')
            .then(response => {
                // Garantir que todos os IDs sejam strings
                if (Array.isArray(response.data)) {
                    response.data.forEach(employee => {
                        if (employee.id !== undefined) {
                            employee.id = String(employee.id);
                        }
                    });
                }
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
                throw error;
            });
    },

    getEmployeeById(id) {
        const formattedId = formatId(id);
        return api.get(`/api/employees/${formattedId}`)
            .then(response => {
                // Garantir que o ID seja string
                if (response.data && response.data.id !== undefined) {
                    response.data.id = String(response.data.id);
                }
                return response.data;
            })
            .catch(error => {
                console.error(`Error fetching employee with id ${formattedId}:`, error);
                throw error;
            });
    },

    createEmployee(employee) {
        return api.post('/api/employees', employee)
            .then(response => {
                // Garantir que o ID retornado seja string
                if (response.data && response.data.id !== undefined) {
                    response.data.id = String(response.data.id);
                }
                return response.data;
            })
            .catch(error => {
                console.error('Error creating employee:', error);
                throw error;
            });
    },

    updateEmployee(employee) {
        // Formatar o ID para remover qualquer caractere ":" e texto após ele
        const formattedId = formatId(employee.id);

        // Formatar o objeto de funcionário para o formato esperado pelo backend
        const formattedEmployee = formatEmployeeForUpdate(employee);

        return api.put(`/api/employees/${formattedId}`, formattedEmployee)
            .then(response => {
                // Garantir que qualquer dado retornado tenha ID como string
                if (response.data && response.data.id !== undefined) {
                    response.data.id = String(response.data.id);
                }
                return response.data;
            })
            .catch(error => {
                console.error(`Error updating employee with id ${formattedId}:`, error);
                throw error;
            });
    },

    deleteEmployee(id) {
        const formattedId = formatId(id);
        return api.delete(`/api/employees/${formattedId}`)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error(`Error deleting employee with id ${formattedId}:`, error);
                throw error;
            });
    },

    uploadEmployeePhoto(file) {
        const formData = new FormData();
        formData.append('photo', file);

        return api.post('/api/employees/uploadPhoto', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => response.data.photoUrl)
            .catch(error => {
                console.error('Error uploading employee photo:', error);
                throw error;
            });
    }
}
