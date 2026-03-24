import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'
import { swaggerDocsURL } from './config';

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },
  {
    href: '/appeal-dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Appeal Dashboard',
    permissions: 'READ_CASES',
  },
  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/roles/roles-list',
    label: 'Roles',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountVariantOutline ?? icon.mdiTable,
    permissions: 'READ_ROLES'
  },
  {
    href: '/permissions/permissions-list',
    label: 'Permissions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountOutline ?? icon.mdiTable,
    permissions: 'READ_PERMISSIONS'
  },
  {
    href: '/organizations/organizations-list',
    label: 'Organizations',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_ORGANIZATIONS'
  },
  {
    href: '/payers/payers-list',
    label: 'Payers',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiBank' in icon ? icon['mdiBank' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_PAYERS'
  },
  {
    href: '/cases/cases-list',
    label: 'Cases',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiBriefcase' in icon ? icon['mdiBriefcase' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_CASES'
  },
  {
    href: '/tasks/tasks-list',
    label: 'Tasks',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiClipboardCheck' in icon ? icon['mdiClipboardCheck' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_TASKS'
  },
  {
    href: '/documents/documents-list',
    label: 'Documents',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiFileDocumentMultiple' in icon ? icon['mdiFileDocumentMultiple' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_DOCUMENTS'
  },
  {
    href: '/appeal_drafts/appeal_drafts-list',
    label: 'Appeal drafts',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiFileEdit' in icon ? icon['mdiFileEdit' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_APPEAL_DRAFTS'
  },
  {
    href: '/notes/notes-list',
    label: 'Notes',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiNoteText' in icon ? icon['mdiNoteText' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_NOTES'
  },
  {
    href: '/activity_logs/activity_logs-list',
    label: 'Activity logs',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiHistory' in icon ? icon['mdiHistory' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_ACTIVITY_LOGS'
  },
  {
    href: '/settings/settings-list',
    label: 'Settings',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCog' in icon ? icon['mdiCog' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_SETTINGS'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },
  {
    href: swaggerDocsURL,
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  }
]

export default menuAside
