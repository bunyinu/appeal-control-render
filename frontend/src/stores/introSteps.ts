interface Step {
  element: string;
  intro: string;
  position?: string;
  tooltipClass?: string;
  highlightClass?: string;
  disableInteraction?: boolean;
}

interface Hint {
  element: string;
  hint: string;
  hintPosition?: string;
}

export const loginSteps: Step[] = [

  {
    element: '#elementId1',
    intro: `
          <div class="text-center text-black ">
            <p class="mb-2 font-semibold">Welcome to Appeal Control</p>
            <p>Take a quick tour of the main workflows for appeals, cases, tasks, and supporting documents.</p>
          </div>
        `,
    position: 'auto',
    tooltipClass: ' good-img',
  },
  {
    element: '#loginRoles',
    intro:
      'Choose your login role to proceed. Experience the app as  a Super Admin,  Admin, or  User, or create your own account to get started.',
    position: 'auto',
  },
];

export const appSteps: Step[] = [
  {
    element: '#profilEdit',
    intro:
      "Update your profile information, including name, email, and password. Don't forget to save your changes to keep your profile current.",
    position: 'auto',
    disableInteraction: true,
  },
  {
    element: '#themeToggle',
    intro: 'Switch between light and dark modes to suit your preference.',
    position: 'auto',
    disableInteraction: true,
  },
  {
    element: '#logout',
    intro:
      'Log out or switch users/roles with ease to manage your access.',
    position: 'auto',
    disableInteraction: true,
  },
  {
    element: '#search',
    intro:
      'Quickly find specific data or items by entering your query in the search field. Navigate directly to the desired element.',
    position: 'auto',
    disableInteraction: true,
  },
  {
    element: '#widgetCreator',
    intro:
      'Use Text-to-Chart and Text-to-Widget to create charts or widgets from text descriptions. Type what you need, like "Orders by Month," and customize your dashboard.',
    position: 'auto',
    disableInteraction: true,
  },
  {
    element: '#dashboard',
    intro:
      'View all the entities available to your role, offering insights into the data categories and total items in each.',
    position: 'auto',
    disableInteraction: true,
  },
  {
    element: '#asideMenu',
    intro:
      'Access various entities and manage your data. Find links to  Swagger API documentation for more information.',
    position: 'auto',
    disableInteraction: true,
  },
  {
    element: '#asideMenu',
    intro: "Let's explore the User entity.",
    position: 'auto',
    disableInteraction: true,
  },
];

export const usersSteps: Step[] = [
  {
    element: '#usersList',
    intro:
      'Invite new users, filter data, and work with CSV files in this section.',
    position: 'auto',
    disableInteraction: true,
  },
  {
    element: '#usersTable',
    intro:
      'View, modify, or delete items with the necessary permissions. Inline editing is available within the table.',
    position: 'auto',
    disableInteraction: true,
  },
  {
    element: '#asideMenu',
    intro: "Let's explore the Roles entity.",
    position: 'auto',
    disableInteraction: true,
  },
  
];

export const rolesSteps: Step[] = [
  {
    element: '#rolesTable',
    intro:
      'Super Admin can manage roles and permissions. Adjust access levels and permissions for each role or user in the Roles and Permissions sections.',
    position: 'auto',
    disableInteraction: true,
  },
  {
    element: '#feedbackSection', 
    intro: `
    <div class="text-center ">
      <p class="mb-2 font-semibold">Tour complete</p>
      <p>Thank you for reviewing the workspace. You have seen the main areas for navigation, dashboards, users, roles, and permissions.</p>
      <p>If you need help with this deployment, contact your internal system administrator.</p>
    </div>
  `,
    position: 'auto',
    tooltipClass: 'end-img',
  },
];
