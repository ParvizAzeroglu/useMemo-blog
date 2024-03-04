import React, { ChangeEvent, Suspense, memo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { generateArticle } from "./utils/generateArticle";

const Loading = () => {
  console.log("Loading");
  return <p>Loading</p>;
};

interface postsProps {
  header: string;
  text: string;
}

const App = () => {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<postsProps[]>([]);

  return (
    <Suspense fallback={<Loading />}>
      <div className="bg-slate-800 p-0.5">
        <Header i18n={i18n} />
        <InputHeader t={t} setPosts={setPosts} />
        <div className="flex flex-wrap justify-center">
          <Posts posts={posts} />
          <Archive />
        </div>
      </div>
    </Suspense>
  );
};

const Posts: React.FC<{ posts: postsProps[] }> = ({ posts }) => {
  return posts.map((item, i: number) => {
    return <Article header={item.header} text={item.text} key={i} />;
  });
};

const Article = ({ header, text }: { header: string; text: string }) => {
  return (
    <div className="bg-slate-600 rounded-md m-3 w-60 h-40 p-2 shadow-lg">
      <h2 className="text-slate-50 font-semibold">{header}</h2>
      <p className="text-slate-300">{text}</p>
    </div>
  );
};

const Archive = memo(() => {
  const archives = Array.from({ length: 5000 }, () => generateArticle());
  return archives.map(
    ({ text, header }: { header: string; text: string }, index) => {
      return <Article text={text} header={header} key={index} />;
    },
  );
});

// @ts-expect-error: next-line (There is no declaration)
const Header = ({ i18n }) => {
  const browserLanguage: string = i18n.language;
  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    i18n.changeLanguage(selectedValue);
  };

  return (
    <div className="bg-slate-600 mx-5 my-3 p-3 rounded-md flex items-center justify-center shadow-xl relative">
      <p className="text-slate-50 font-bold text-xl tracking-wider">
        useMemo Blog
      </p>
      <div>
        <select
          className="absolute right-0 top-0 mt-3 mr-3 rounded-md bg-slate-300"
          onChange={handleLanguageChange}
          value={browserLanguage}
        >
          <option value="az">AZ</option>
          <option value="en">EN</option>
          <option value="ru">RU</option>
          <option value="tr">TR</option>
        </select>
      </div>
    </div>
  );
};

// @ts-expect-error: next-line (There is no declaration)
const InputHeader = ({ t, setPosts }) => {
  const headerRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLInputElement | null>(null);

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const headerValue = headerRef.current?.value.trim();
    const textValue = textRef.current?.value.trim();

    if (!headerValue || !textValue) {
      return;
    }

    setPosts((prev: { header: string; text: string }[]) => [
      ...prev,
      {
        header: headerValue,
        text: textValue,
      },
    ]);

    if (headerRef.current) {
      headerRef.current.value = "";
    }

    if (textRef.current) {
      textRef.current.value = "";
    }
  };

  return (
    <div className="bg-slate-600 mx-5 my-5 p-4 rounded-md grid grid-rows-1 grid-cols-10 gap-2 shadow-lg">
      <label
        htmlFor="header"
        className="text-slate-200 font-medium tracking-wide col-span-1 text-center"
      >
        {t("HEADER")}
      </label>
      <input
        type="text"
        id="header"
        className="col-span-2 rounded-sm bg-slate-300 text-sm px-1 focus:outline-none focus:ring focus:ring-slate-300 focus:inset-2 
        text-slate-900 font-normal"
        maxLength={25}
        ref={headerRef}
        minLength={3}
      />

      <label
        htmlFor="text"
        className="text-slate-200 font-medium tracking-wide col-span-1 text-center"
      >
        {t("TEXT")}
      </label>
      <input
        type="text"
        id="text"
        className="col-span-4 rounded-sm bg-slate-300 text-sm px-1 focus:outline-none focus:ring focus:ring-slate-300 focus:inset-2
        font-normal"
        maxLength={50}
        ref={textRef}
        minLength={3}
      />

      <button
        className="bg-lime-500 text-lime-200 rounded-md font-bold uppercase tracking-wider text-sm shadow-md"
        onClick={handleAddClick}
      >
        {t("ADD")}
      </button>
      <button className="bg-red-600 text-red-200 rounded-md font-bold uppercase tracking-wider text-sm shadow-md">
        {t("CLEAR")}
      </button>
    </div>
  );
};

export default App;
