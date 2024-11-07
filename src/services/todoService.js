import axios from "axios";
import React, { useEffect, useState } from 'react';

const API_URL = "http://localhost:5042/api/todo"; 

const ToDoList = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await axios.get(API_URL);
                console.log("Todos fetched:", response.data); 
                setTodos(response.data);
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };

        fetchTodos();
    }, []);

    return (
        <div>
            <h1>To-Do List</h1>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.isCompleted}
                            onChange={(e) => updateTodoCompletion(todo.id, e.target.checked)}
                        />
                        {todo.Titel} - {todo.isCompleted ? "Completed" : "Pending"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDoList;
