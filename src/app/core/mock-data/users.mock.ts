import { User } from '../models/user.model';

export const MOCK_ADMIN_USER: User = {
  id: 'usr-001',
  fullName: 'Alex Morris',
  username: 'alex.morris',
  email: 'alex.morris',
  role: 'ADMIN',
  status: 'ACTIVE',
  createdAt: '2025-01-15T09:00:00Z',
  avatarInitials: 'AM',
};

export const MOCK_VIEWER_USER: User = {
  id: 'usr-002',
  fullName: 'Sarah Chen',
  username: 'sarah.chen',
  email: 'sarah.chen',
  role: 'VIEWER',
  status: 'ACTIVE',
  createdAt: '2025-02-10T10:15:00Z',
  avatarInitials: 'SC',
};

export const MOCK_USERS: User[] = [
  MOCK_ADMIN_USER,
  MOCK_VIEWER_USER,
  {
    id: 'usr-003',
    fullName: 'Marcus Vance',
    username: 'marcus.vance',
    email: 'marcus.vance',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2025-03-01T11:20:00Z',
    avatarInitials: 'MV',
  },
  {
    id: 'usr-004',
    fullName: 'Elena Rostova',
    username: 'elena.rostova',
    email: 'elena.rostova',
    role: 'VIEWER',
    status: 'ACTIVE',
    createdAt: '2025-04-18T13:45:00Z',
    avatarInitials: 'ER',
  },
  {
    id: 'usr-005',
    fullName: 'David Kim',
    username: 'david.kim',
    email: 'david.kim',
    role: 'VIEWER',
    status: 'INACTIVE',
    createdAt: '2025-05-12T08:00:00Z',
    avatarInitials: 'DK',
  },
  {
    id: 'usr-006',
    fullName: 'Rachel Adams',
    username: 'rachel.adams',
    email: 'rachel.adams',
    role: 'VIEWER',
    status: 'ACTIVE',
    createdAt: '2025-06-25T15:30:00Z',
    avatarInitials: 'RA',
  },
];
