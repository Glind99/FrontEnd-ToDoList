import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [animatingTodoId, setAnimatingTodoId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Separera todos i två listor

    const completedTodos = todos.filter(todo => todo.isCompleted);
    const notCompletedTodos = todos.filter(todo => !todo.isCompleted);
   
    // Hämta alla todos
    useEffect(() => {
        const fetchInitialTodos = async () => {
            try {
                const response = await fetch('https://localhost:7071/api/todo'); /* Tillfälligt, skapa en .env fil framöver*/
                if (response.ok) {
                    const data = await response.json();
                    setTodos(data);
                }
            } catch (error) {
                console.error('Error fetching initial todos:', error);
            }
        };

        fetchInitialTodos();
    }, []);

    // Lägg till en ny todo
    const addTodo = async () => {
        setIsLoading(true);
        const newTodo = {
            titel: newTodoTitle,
            description: newTodoDescription,
            isCompleted: false
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await axios.post('https://localhost:7071/api/todo', newTodo); /* Tillfälligt, skapa en .env fil framöver*/
            setTodos([...todos, response.data]);
            setNewTodoTitle('');
            setNewTodoDescription('');
        } catch (error) {
            console.error("Det gick inte att lägga till uppgiften:", error);
        } finally {
            setIsLoading(false); // Sluta visa laddning
        }
    };

    // Ta bort en todo
    const deleteTodo = async (id) => {
        if (window.confirm('Är du säker på att du vill ta bort denna uppgift?')) {
            try {
                await axios.delete(`https://localhost:7071/api/todo/${id}`); /* Tillfälligt, skapa en .env fil framöver*/
                setTodos(todos.filter(todo => todo.id !== id));
            } catch (error) {
                console.error("Det gick inte att ta bort uppgiften:", error);
            }
        }
    };
    
    // eslint-disable-next-line no-unused-vars
    const fetchTodos = async () => {
        try {
            const response = await fetch('http://localhost:5038/api/Todo'); /* Tillfälligt, skapa en .env fil framöver*/
            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
            }
        };

        const updateTodoCompletion = async (id, isCompleted) => {
            try {
                // Sätt animering state
                setAnimatingTodoId(id);

                // Uppdatera lokalt state först
                setTodos(prevTodos => 
                    prevTodos.map(todo => 
                        todo.id === id 
                            ? { ...todo, isCompleted } 
                            : todo
                    )
                );
        
                // Skicka till API
                const response = await fetch(`http://localhost:5038/api/Todo/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ isCompleted })
                });
        
                // Kortare väntetid som matchar CSS
                setTimeout(() => {
                    setAnimatingTodoId(null);
                    }, 300);  // 300ms = 0.3s
        
                if (!response.ok) {
                    // Om API-anropet misslyckas, återställ state
                    setTodos(prevTodos => 
                        prevTodos.map(todo => 
                            todo.id === id 
                                ? { ...todo, isCompleted: !isCompleted } 
                                : todo
                        )
                    );
                }
            } catch (error) {
                console.error('Error updating todo:', error);
                setAnimatingTodoId(null);
            }
        };

    return (
        <div>
            <h1>To Do List</h1>
    
            {/* Formulär för att lägga till ny todo */}
            <div className="add-todo-container">
                <input
                    type="text"
                    placeholder="Ny uppgift"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    disabled={isLoading}
                />
                <input
                    type="text"
                    placeholder="Beskrivning"
                    value={newTodoDescription}
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                    disabled={isLoading}
                />
                <button 
                    onClick={addTodo} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            Lägger till... 
                            <span className="loading-spinner"></span>
                        </>
                    ) : (
                        'Lägg till'
                    )}
                </button>
            </div>
    
            <div className="todo-container">
                {/* Vänster kolumn - Ej avklarade */}
                <div className="todo-column">
                    <h2>Ej avklarade uppgifter</h2>
                    <ul>
                        {notCompletedTodos.map(todo => (
                            <li 
                                key={todo.id} 
                                className={`todo-item ${animatingTodoId === todo.id ? 'fade-out' : ''}`}
                            >
                                <div className="todo-content">
                                    <span className="title">{todo.titel}</span>
                                    <span className="description">{todo.description}</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={todo.isCompleted}
                                    onChange={(e) => updateTodoCompletion(todo.id, e.target.checked)}
                                />
                                <button onClick={() => deleteTodo(todo.id)}>Ta bort</button>
                            </li>
                        ))}
                    </ul>
                </div>
    
                {/* Höger kolumn - Avklarade */}
                <div className="todo-column">
                    <h2>Avklarade uppgifter</h2>
                    <ul>
                        {completedTodos.map(todo => (
                            <li 
                                key={todo.id} 
                                className="completed-item"
                            >
                                <div className="todo-content">
                                    <span className="title">{todo.titel}</span>
                                    <span className="description">{todo.description}</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={todo.isCompleted}
                                    onChange={(e) => updateTodoCompletion(todo.id, e.target.checked)}
                                />
                                <button onClick={() => deleteTodo(todo.id)}>Ta bort</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
