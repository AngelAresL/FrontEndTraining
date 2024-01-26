import { Link } from "react-router-dom";
import ChangeRol from "../../components/ChangeRol";
import RegisterPage from "../Register/RegisterPage";

const AdminUserSetting = () => {
  return (
    <>
      <RegisterPage />
      <Link to="/admin/ajustes/rol">Cambio de Rol</Link>
    </>
  );
};

export default AdminUserSetting;
