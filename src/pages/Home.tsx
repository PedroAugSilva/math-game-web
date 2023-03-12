import { changeAvatar, avatar } from "../utils/avatars";
import { useForm, SubmitHandler } from "react-hook-form";
import usePersistedState from "../utils/usePersistedState";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import Modal from "../components/Modal";
import { CaretLeft, CaretRight } from "phosphor-react";
import colors from "tailwindcss/colors";
import socket from "socket.io-client";

interface IUser {
  username: string;
  avatar: string;
}

interface IUserForm {
  username: string;
}

const Home = () => {
  const { register, handleSubmit } = useForm<IUser>();

  const [image, setImage] = useState<string>();

  const [user, setUser] = usePersistedState<IUser>("user", {
    username: "",
    avatar: changeAvatar(),
  });

  const handleChangeImage = (work: "back" | "skip") => {
    switch (work) {
      case "back":
        setUser((preValue) => {
          const index = avatar.indexOf(preValue.avatar!);
          return {
            username: preValue.username,
            avatar: avatar[index === 0 ? avatar.length - 1 : index - 1],
          };
        });
        break;

      case "skip":
        setUser((preValue) => {
          const index = avatar.indexOf(preValue.avatar!);
          return {
            username: preValue.username,
            avatar: avatar[index === avatar.length - 1 ? 0 : index + 1],
          };
        });
        break;
    }
  };

  const handleSubmitForm: SubmitHandler<IUserForm> = (data) => {
    setUser((preValue) => {
      return {
        username: data.username,
        avatar: preValue.avatar,
      };
    });
    const io = socket("http://localhost:3000/");
    io.on("hello", (socket) => {
      console.log(socket.id);
    });
  };

  return (
    <div className="w-content h-content bg-white drop-shadow-2xl rounded-2xl py-10 px-5">
      <div className="flex items-center flex-col justify-center w-full">
        <div className=" h-content flex flexl-row items-center group ">
          <button
            className="w-content opacity-0 group-hover:opacity-100 transition-all"
            onClick={() => handleChangeImage("back")}
          >
            <CaretLeft size={40} color={colors.blue[500]} />
          </button>
          <img
            src={user.avatar}
            alt=""
            className="rounded-full border-4 border-blue-500 w-52 h-52 p-1"
          />
          <button
            className="w-content opacity-0 group-hover:opacity-100 transition-all"
            onClick={() => handleChangeImage("skip")}
          >
            <CaretRight size={40} color={colors.blue[500]} />
          </button>
        </div>
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
          <Dialog.Root>
            <Dialog.Trigger
              className="h-10 w-full mt-3 bg-blue-500 rounded-full px-3 text-lg text-white font-semibold transition-all hover:scale-105"
              type="submit"
            >
              Procurar oponente
            </Dialog.Trigger>
            <Modal avatar={user.avatar} username={user.username} />
          </Dialog.Root>
        </form>
      </div>
    </div>
  );
};

export default Home;
