import CallTab from '../Components/Chatting/Components/UserKit/ComponentsTab/Call_tab';
import ContactUser from '../Components/Chatting/Components/UserKit/ComponentsTab/Chat_tab/ContactUser';
import ContactTab from '../Components/Chatting/Components/UserKit/ComponentsTab/Contact_tab';
import NotificationTab from '../Components/Chatting/Components/UserKit/ComponentsTab/Notification_tab';

export const userKit = [
  {
    id: 1,
    title: 'Chats',
    iconContext: 'fa-comments',
    content: <ContactUser />,
  },
  {
    id: 2,
    title: 'Calls',
    iconContext: 'fa-phone-square',
    content: <CallTab />,
  },
  {
    id: 3,
    title: 'Contacts',
    iconContext: 'fa-address-book',
    content: <ContactTab />,
  },
  {
    id: 4,
    title: 'Notification',
    iconContext: 'fa-bell',
    content: <NotificationTab />,
  },
];
