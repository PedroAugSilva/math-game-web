import { ArrowCounterClockwise } from "phosphor-react";
import color from "tailwindcss/colors";
import { changeAvatar } from "../utils/avatars";
import { useForm, SubmitHandler } from "react-hook-form";
import usePersistedState from "../utils/usePersistedState";
import * as Modal from "@radix-ui/react-dialog";

interface IUser {
  username: string;
  avatar: string;
}

interface IUserForm {
  username: string;
}

const Home = () => {
  const [user, setUser] = usePersistedState<IUser>("user", {
    username: "",
    avatar: changeAvatar(),
  });

  const handleChangeImage = () => {
    setUser((preValue) => {
      return {
        username: preValue.username,
        avatar: changeAvatar(),
      };
    });
  };

  const { register, handleSubmit } = useForm<IUser>();

  const handleSubmitForm: SubmitHandler<IUserForm> = (data) => {
    setUser((preValue) => {
      return {
        username: data.username,
        avatar: preValue.avatar,
      };
    });
  };

  return (
    <div className="w-content h-content bg-white drop-shadow-2xl rounded-2xl p-10">
      <div className="flex items-center flex-col justify-center">
        <figure className="flex items-center justify-center group relative">
          <img
            src={user.avatar}
            alt=""
            className="rounded-full border-4 border-blue-500 w-[200px] h-[200px] p-1 "
          />
          <button
            onClick={handleChangeImage}
            className="absolute w-full h-full flex items-center justify-center transition-all duration-300 rounded-full bg-black bg-opacity-70 opacity-0 group-hover:opacity-100"
          >
            <ArrowCounterClockwise size={70} color={color.blue[500]} />
          </button>
        </figure>
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <input
            type="text"
            className="border-2 border-blue-500 rounded-full h-10 w-full px-3 outline-none mt-5"
            placeholder="Nome de usuário"
            defaultValue={user.username}
            {...register("username")}
          />
          <Modal.Root>
            <Modal.Trigger className="h-10 w-full mt-3 bg-blue-500 rounded-full px-3 text-lg text-white font-semibold transition-all hover:scale-105">
              Procurar oponente
            </Modal.Trigger>
            <Modal.Portal>
              <Modal.Overlay />
              <Modal.Content></Modal.Content>
            </Modal.Portal>
          </Modal.Root>
        </form>
      </div>
    </div>
  );
};

export default Home;
