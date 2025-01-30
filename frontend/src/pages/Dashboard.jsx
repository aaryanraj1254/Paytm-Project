// Fetch user balance and list of users from the backend.
// Display balance and user list.
// Add a "Send Money" button to open a modal.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [balance, setBalance] = useState(0);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        
        async function fetchData() {
            try {
                const balanceRes = await fetch("http://localhost:5000/api/balance");
                const usersRes = await fetch("http://localhost:5000/api/users");

                const balanceData = await balanceRes.json();
                const usersData = await usersRes.json();

                setBalance(balanceData.balance);
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Your Balance: ₹{balance}</h2>

            <h3>Users:</h3>
            <ul>
                {users.map(user => (
                    <li key={user._id}>{user.username}</li>
                ))}
            </ul>

            <button onClick={() => setShowModal(true)}>Send Money</button>

            {showModal && <SendMoneyModal onClose={() => setShowModal(false)} />}
        </div>
    );
}

function SendMoneyModal({ onClose }) {
    const [amount, setAmount] = useState("");
    const [toUser, setToUser] = useState("");

    const handleSendMoney = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/transfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, to: toUser })
            });

            const result = await response.json();
            if (result.message === "Transfer successful") {
                alert("Money sent successfully!");
                onClose();
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("Error sending money");
        }
    };

    return (
        <div className="modal">
            <h2>Send Money</h2>
            <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter recipient ID"
                value={toUser}
                onChange={(e) => setToUser(e.target.value)}
            />
            <button onClick={handleSendMoney}>Send</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
}







