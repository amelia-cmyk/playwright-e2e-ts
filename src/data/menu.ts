/** Main menu modules of OrangeHRM and the page header each one shows. */
export const MENU_MODULES = [
  { menu: 'Admin', header: 'Admin', path: '/admin/' },
  { menu: 'PIM', header: 'PIM', path: '/pim/' },
  { menu: 'Leave', header: 'Leave', path: '/leave/' },
  { menu: 'Time', header: 'Time', path: '/time/' },
  { menu: 'Recruitment', header: 'Recruitment', path: '/recruitment/' },
  { menu: 'My Info', header: 'PIM', path: '/pim/view(My|Personal)Details' },
  { menu: 'Performance', header: 'Performance', path: '/performance/' },
  { menu: 'Dashboard', header: 'Dashboard', path: '/dashboard/' },
  { menu: 'Directory', header: 'Directory', path: '/directory/' },
  { menu: 'Claim', header: 'Claim', path: '/claim/' },
  { menu: 'Buzz', header: 'Buzz', path: '/buzz/' },
] as const;
