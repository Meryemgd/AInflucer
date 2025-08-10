import React, { useEffect, useState } from "react";
import axios from "axios";

function LandingPage() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/api/public/landing")
            .then(res => setMessage(res.data.message))
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>{message}</h1>
                <p style={styles.subtitle}>
                    Gérez vos réseaux sociaux avec la puissance de l'IA 🤖
                </p>
                <div style={styles.buttonContainer}>
                    <button style={{ ...styles.button, backgroundColor: "#4CAF50" }}>Login</button>
                    <button style={{ ...styles.button, backgroundColor: "#2196F3" }}>Register</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        background: "linear-gradient(135deg, #1f1c2c, #928DAB)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#fff",
        textAlign: "center",
        padding: "20px"
    },
    card: {
        background: "rgba(255, 255, 255, 0.1)",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(8px)",
        maxWidth: "500px"
    },
    title: {
        fontSize: "2.5rem",
        marginBottom: "10px"
    },
    subtitle: {
        fontSize: "1.2rem",
        marginBottom: "30px",
        color: "#ddd"
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "15px"
    },
    button: {
        border: "none",
        color: "#fff",
        padding: "12px 25px",
        fontSize: "1rem",
        borderRadius: "30px",
        cursor: "pointer",
        transition: "0.3s"
    }
};

export default LandingPage;
