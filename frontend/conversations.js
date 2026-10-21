const names = [
  'Aman Sharma', 'Priya Singh', 'Rahul Verma', 'Sneha Patel', 'Vikram Mehta', 'Neha Gupta', 'Arjun Kapoor', 'Ananya Yadav', 'Rohit Joshi', 'Isha Malhotra',
  'Karan Mishra', 'Pooja Jain', 'Sahil Agarwal', 'Riya Rao', 'Aditya Saxena', 'Nisha Bhat', 'Kabir Nair', 'Meera Sethi', 'Dev Kumar', 'Simran Chopra',
  'Varun Sharma', 'Tanya Singh', 'Harsh Verma', 'Aditi Patel', 'Yash Mehta', 'Kavya Gupta', 'Mohit Kapoor', 'Diya Yadav', 'Rohan Joshi', 'Sakshi Malhotra',
  'Aman Yadav', 'Priya Joshi', 'Rahul Malhotra', 'Sneha Mishra', 'Vikram Jain', 'Neha Agarwal', 'Arjun Rao', 'Ananya Saxena', 'Rohit Bhat', 'Isha Nair',
  'Karan Sethi', 'Pooja Kumar', 'Sahil Chopra', 'Riya Sharma', 'Aditya Singh', 'Nisha Verma', 'Kabir Patel', 'Meera Mehta', 'Dev Gupta', 'Simran Kapoor',
  'Varun Yadav', 'Tanya Joshi', 'Harsh Malhotra', 'Aditi Mishra', 'Yash Jain', 'Kavya Agarwal', 'Mohit Rao', 'Diya Saxena', 'Rohan Bhat', 'Sakshi Nair',
  'Aman Saxena', 'Priya Bhat', 'Rahul Nair', 'Sneha Sethi', 'Vikram Kumar', 'Neha Chopra', 'Arjun Sharma', 'Ananya Singh', 'Rohit Verma', 'Isha Patel',
  'Karan Mehta', 'Pooja Gupta', 'Sahil Kapoor', 'Riya Yadav', 'Aditya Joshi', 'Nisha Malhotra', 'Kabir Mishra', 'Meera Jain', 'Dev Agarwal', 'Simran Rao',
  'Varun Saxena', 'Tanya Bhat', 'Harsh Nair', 'Aditi Sethi', 'Yash Kumar', 'Kavya Chopra', 'Mohit Sharma', 'Diya Singh', 'Rohan Verma', 'Sakshi Patel',
  'Aman Singh', 'Priya Verma', 'Rahul Patel', 'Sneha Mehta', 'Vikram Gupta', 'Neha Kapoor', 'Arjun Yadav', 'Ananya Joshi', 'Rohit Malhotra', 'Isha Mishra',
  'Karan Jain', 'Pooja Agarwal', 'Sahil Rao', 'Riya Saxena', 'Aditya Bhat', 'Nisha Nair', 'Kabir Sethi', 'Meera Kumar', 'Dev Chopra', 'Simran Sharma',
  'Varun Singh', 'Tanya Verma', 'Harsh Patel', 'Aditi Mehta', 'Yash Gupta', 'Kavya Kapoor', 'Mohit Yadav', 'Diya Joshi', 'Rohan Malhotra', 'Sakshi Mishra',
];

const messageTemplates = [
  [['Hey, how are you?', 'I am doing well!', 'Great, see you soon!'], ['09:00 AM', '09:02 AM', '09:04 AM']],
  [['Can you share the project notes?', 'Sure, I will share them.', 'Sounds good to me.'], ['10:07 AM', '10:09 AM', '10:11 AM']],
  [['Are we working on the UI today?', 'I am starting in a few minutes.', 'We can discuss it after class.'], ['11:14 AM', '11:16 AM', '11:18 AM']],
  [['How is your preparation going?', 'It is going well so far.', 'Okay, talk soon!'], ['12:21 AM', '12:23 AM', '12:25 AM']],
  [['Did you finish the React assignment?', 'Almost done, just testing it.', 'Let me know if you need help.'], ['09:28 AM', '09:30 AM', '09:32 AM']],
  [['Have you tested the app?', 'Yes, it is working now.', 'Nice, keep me posted.'], ['10:35 AM', '10:37 AM', '10:39 AM']],
  [['Did you check the latest update?', 'I will check it today.', 'Awesome, thanks!'], ['11:42 AM', '11:44 AM', '11:46 AM']],
  [['Are you joining the class today?', 'Yes, I will be there.', 'Thanks for the update!'], ['12:49 AM', '12:51 AM', '12:53 AM']],
  [['What time is our meeting?', 'Let us meet at 4 PM.', 'Please send it when ready.'], ['09:56 AM', '09:58 AM', '09:00 AM']],
  [['Can we discuss the project?', 'Of course, let us connect.', 'That works for me.'], ['10:03 AM', '10:05 AM', '10:07 AM']],
];

const getInitials = (name) => name.split(' ').map((part) => part[0]).join('');
const getSender = (name) => name.split(' ')[0];

export const conversationsSeed = names.map((name, index) => {
  const id = index + 1;
  const [texts, times] = messageTemplates[index % messageTemplates.length];
  const messageCount = id % 7 === 1 ? 2 : 3;

  return {
    id,
    name,
    avatar: getInitials(name),
    unreadCount: index % 4,
    messages: texts.slice(0, messageCount).map((text, messageIndex) => ({
      id: messageIndex + 1,
      sender: messageIndex === 1 ? 'me' : getSender(name),
      text,
      time: times[messageIndex],
    })),
  };
});
