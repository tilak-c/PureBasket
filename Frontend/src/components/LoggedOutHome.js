import "../styles/LoggedOutHome.css";  
import groceryBg from "../assets/grocery.png"; 

export default function LoggedOutHome() {
  return (
    <div
      className="loggedout-container"
      style={{ backgroundImage: `url(${groceryBg})` }}
    >
    </div>
  );
}
