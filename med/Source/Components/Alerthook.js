// const { showAlert, AlertWrapper } = useCustomAlert();
  
// showAlert({
//   title: "Leaving So Soon?",
//   message:  "You're about to exit the app. Are you sure you want to leave all this deliciousness behind?",
//   codeMassage: { code: '501', text: "User wants to go back", imagePath: leavingImage},
//   buttons: [
//     { icon: 'thumbs-up', text: "No, Stay", onPress: () => null, styleColor: Colors.dark.colors.diffrentColorRed },
//     { text: "Yes, Exit", onPress: () => BackHandler.exitApp(), styleColor: Colors.dark.colors.diffrentColorGreen }
//   ],
//   additional: [
//     { head: "No, Stay", head2: "onPress:null" },
//     { head: "Yes, Exit", head2: "onPress:exitApp()" }
//   ]
// });


import { useState } from 'react';
import AlertCustom from './AlertCustom';

const useCustomAlert = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [title, settitle] = useState('');
  const [buttons, setButtons] = useState([]);
  const [additional, setAdditional] = useState([]);
  const [codeMassage, setCodeMassage] = useState([]);

  const showAlert = ({ title, message, codeMassage, buttons, additional = [] }) => {
    settitle(title);
    setCodeMassage(codeMassage);
    setMessage(message);
    setButtons(buttons);
    setAdditional(additional);
    setVisible(true);
  };

  const closeAlert = () => {
    setVisible(false);
  };

  const AlertWrapper = () => (
    <AlertCustom visible={visible} title={title} codeMassage={codeMassage} message={message} buttons={buttons} additional={additional} onClose={closeAlert} />
  );

  return { showAlert, AlertWrapper };
};

export default useCustomAlert;
