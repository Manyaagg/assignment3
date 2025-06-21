import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

const users = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'Editor' },
  { id: 3, name: 'Charlie', role: 'Viewer' },
];

const chartData = [
  { month: 'Jan', users: 400 },
  { month: 'Feb', users: 800 },
  { month: 'Mar', users: 600 },
  { month: 'Apr', users: 900 },
  { month: 'May', users: 1200 },
];

const initialColumns = {
  todo: {
    name: 'To Do',
    items: [
      { id: 'task-1', content: 'Design new homepage' },
      { id: 'task-2', content: 'Fix bugs in login' },
    ],
  },
  inProgress: {
    name: 'In Progress',
    items: [{ id: 'task-3', content: 'Update user profile page' }],
  },
  done: {
    name: 'Done',
    items: [{ id: 'task-4', content: 'Deploy v1.0' }],
  },
};

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return [isDark, setIsDark];
}

function ThemeToggle() {
  const [isDark, setIsDark] = useDarkMode();
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}

function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">User Analytics</h2>
        <LineChart width={400} height={250} data={chartData} className="mx-auto">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Calendar</h2>
        <Calendar locale="en-US" className="w-full" />
      </div>
    </div>
  );
}

function Table() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Users Table</h2>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, role }) => (
            <tr
              key={id}
              className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="py-3 px-6">{id}</td>
              <td className="py-3 px-6">{name}</td>
              <td className="py-3 px-6">{role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Kanban() {
  const [columns, setColumns] = useState(initialColumns);

  function onDragEnd(result) {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const col = columns[source.droppableId];
      const copiedItems = Array.from(col.items);
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...col,
          items: copiedItems,
        },
      });
    } else {
      const sourceCol = columns[source.droppableId];
      const destCol = columns[destination.droppableId];
      const sourceItems = Array.from(sourceCol.items);
      const destItems = Array.from(destCol.items);
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destCol,
          items: destItems,
        },
      });
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Kanban Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto">
          {Object.entries(columns).map(([id, column]) => (
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white dark:bg-gray-800 p-4 rounded shadow min-w-[250px] flex flex-col"
                  style={{ background: snapshot.isDraggingOver ? '#dbeafe' : '' }}
                >
                  <h3 className="font-bold mb-4">{column.name}</h3>
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-3 p-3 rounded shadow cursor-move select-none ${
                            snapshot.isDragging
                              ? 'bg-blue-300 text-white'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
        <nav className="bg-white dark:bg-gray-800 shadow flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
              }
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/table"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
              }
            >
              Table
            </NavLink>
            <NavLink
              to="/kanban"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
              }
            >
              Kanban
            </NavLink>
          </div>
          <ThemeToggle />
        </nav>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/table" element={<Table />} />
            <Route path="/kanban" element={<Kanban />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}