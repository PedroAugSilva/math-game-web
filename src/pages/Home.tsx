import { changeAvatar, avatar } from "../services/utils/avatars";
import { useForm, SubmitHandler } from "react-hook-form";
import usePersistedState from "../hooks/usePersistedState";
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

interface IRoom {
  room_id: string;
  room_name: string;
  participants: [
    {
      name: string;
      socket_id: string;
    }
  ];
}

interface IError {
  message: string;
  error: boolean;
}

const Home = () => {
  const io = socket("http://localhost:3000/");

  const [isConnected, setConnected] = useState<boolean>(false);
  const [oponent, setOponent] = useState<string>();
  const [room, setRoom] = useState<IRoom>();
  const [error, setError] = useState<IError>();

  const [isOpen, setOpen] = useState<boolean>(false);

  io.on("connect", () => {
    setConnected(true);
  });

  const { register, handleSubmit } = useForm<IUser>();

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

  const handleSubmitForm: SubmitHandler<IUserForm> = async (data) => {
    setUser((preValue) => {
      return {
        username: data.username,
        avatar: preValue.avatar,
      };
    });

    io.on("already-exist-user-message", (data3) => {
      setError(data3);
      console.log(data3);
    });
    if (!error?.error) {
      io.on("loading-room", (data2) => {
        console.log(data2);
        setOpen(true);
      });
    }
    io.emit("find-room", {
      ...user,
      socket_id: io.id,
      room_name: "room" + Math.random().toString(8).substr(2),
    });
  };
  return (
    <>
      {!isConnected && (
        <div className="w-screen h-screen absolute inset-0 bg-black bg-opacity-30 z-10 flex items-center justify-center">
          <div className="flex items-center justify-center p-5 bg-black bg-opacity-60 rounded-xl">
            <div className="animate-ping w-7 h-7 rounded-full bg-white" />
          </div>
        </div>
      )}

      <div className="w-content h-content bg-white drop-shadow-2xl rounded-2xl py-10 px-5 ">
        <div className="flex items-center flex-col justify-center w-full">
          <div className=" h-content flex flexl-row items-center group">
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
            <span className="text-red-500 mt-1">
              {error?.error ? error?.message : ""}
            </span>
            <button
              className="h-10 w-full mt-1 bg-blue-500 rounded-full px-3 text-lg text-white font-semibold transition-all hover:scale-105"
              type="submit"
            >
              Procurar oponente
            </button>
          </form>
        </div>
      </div>
      {isOpen && (
        <Modal
          avatar={user.avatar}
          username={user.username}
          oponent={oponent}
          room_id={room?.room_id}
          socket={io}
        />
      )}
    </>
  );
};

export default Home;
