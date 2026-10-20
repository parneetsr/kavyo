import { useAuth, Role } from '../context/AuthContext';

export default function RoleSwitcher() {
  const { role, setRole } = useAuth();

  const roles: Role[] = ['GUEST', 'USER', 'ADMIN'];

  return (
    <div className="bg-gray-800 text-white p-3 flex justify-between items-center text-sm">
      <span>Current Perspective: <strong>{role}</strong></span>
      <div className="space-x-2">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-3 py-1 rounded capitalize ${
              role === r ? 'bg-blue-600 font-bold' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {r.toLowerCase()} View
          </button>
        ))}
      </div>
    </div>
  );
}