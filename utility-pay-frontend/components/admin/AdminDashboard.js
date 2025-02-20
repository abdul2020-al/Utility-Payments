import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [bills, setBills] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const userRes = await axios.get("http://localhost:5000/api/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(userRes.data);

                const billRes = await axios.get("http://localhost:5000/api/admin/bills", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBills(billRes.data);
            } catch (err) {
                setError("Unauthorized or server error");
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsers(users.filter((user) => user._id !== id));
        } catch (err) {
            setError("Failed to delete user");
        }
    };

    const handleUpdateBill = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/admin/bills/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setBills(bills.map((bill) => (bill._id === id ? { ...bill, status } : bill)));
        } catch (err) {
            setError("Failed to update bill");
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>Users</h3>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        {user.name} - {user.email}
                        <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>Bills</h3>
            <ul>
                {bills.map((bill) => (
                    <li key={bill._id}>
                        {bill.utilityType} - ${bill.amount} - {bill.status}
                        <select
                            onChange={(e) => handleUpdateBill(bill._id, e.target.value)}
                            value={bill.status}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
