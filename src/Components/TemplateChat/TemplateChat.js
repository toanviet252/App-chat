import "./template.scss";
import { ReactComponent as Template } from "../../svg/pictemplate.svg";

const TemplateChat = () => {
  return (
    <div className="template-container">
      <h1>Welcome to chat app!</h1>
      <p>Find some friends to starting chat</p>
      <Template className="pic-template" />
    </div>
  );
};
export default TemplateChat;
