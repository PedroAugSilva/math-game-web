import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { avatar } from "../utils/avatars";
import versusImage from "../assets/images/versus.jpg";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface IUser {
  username: string;
  avatar: string;
}

const Modal = (user: IUser) => {
  const [isFind, setFind] = useState<boolean>(true);

  const settingsSlider: Settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 100,
    autoplaySpeed: 100,
    cssEase: "ease-in-out",
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="w-screen h-screen absolute inset-0 bg-black bg-opacity-25 flex justify-center items-center" />
      <Dialog.Content className="w-screen max-w-2xl h-96 bg-white rounded-3xl absolute p-10 justify-between flex flex-col items-center">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-col items-center">
            <figure className="border-4 border-blue-500 w-52 h-auto p-1  rounded-full">
              <img src={user.avatar} className="rounded-full w-full h-full " />
            </figure>
            <h1 className=" bg-blue-500 rounded-full mt-2 w-full text-lg text-white text-center font-bold">
              {user.username}
            </h1>
          </div>
          <img src={versusImage} alt="versus image" className="w-48 h-auto" />
          <div className="flex flex-col items-center">
            {isFind ? (
              <>
                <figure className="flex justify-center border-4 p-1 border-red-500 rounded-full w-52 h-52">
                  <img src={avatar[2]} className="rounded-full w-full h-full" />
                </figure>
                <h1 className=" bg-red-500 rounded-full mt-2 w-full text-lg text-white text-center font-bold">
                  Lorival
                </h1>
              </>
            ) : (
              <>
                <div className="flex justify-start items-center flex-row overflow-hidden w-52 rounded-full">
                  <Slider {...settingsSlider} className="w-52">
                    {avatar.map((item) => (
                      <img
                        src={item}
                        className="rounded-full border-4 p-1 border-red-500 w-52 h-52"
                        key={item}
                      />
                    ))}
                  </Slider>
                </div>
                <h1 className=" bg-red-500 rounded-full mt-2 w-full text-lg text-white text-center font-bold">
                  ???????
                </h1>
              </>
            )}
          </div>
        </div>
        <Dialog.Close className="bg-zinc-500 rounded-full h-10 w-full text-white text-lg font-semibold transition-all duration-300 hover:scale-105 hover:drop-shadow-xl">
          <span>Cancelar</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default Modal;
