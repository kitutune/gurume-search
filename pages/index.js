import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';

// ?format=jsonでjson形式に変更
const defaultEndpoint = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${process.env.API_KEY}&format=json&large_area=Z011`;
// 下記は(https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)の構文
export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: { data }, // はプロップスとしてページコンポーネントに渡されます。
  };
}

export default function Home({ data }) {
  // コンソール画面に表示
  // console.log(data.results.shop);
  useEffect(() => {
    console.log(data.results.shop);
  }, [data]);

  const {
    results_available = 0, //クエリー条件にマッチする、検索結果の全件数
    results_start = 1, //検索結果の開始位置
    shop: defaultShops = [], //[複数要素]を現すshopは空配列のdefaultShopsとする
  } = data.results;

  //取得した店舗データを格納
  const [shop, updateShops] = useState(defaultShops);

  useEffect(() => {
    console.log(shop);
  }, [shop]);

  //取得したページデータを格納
  const [page, updatePage] = useState({
    results_available: results_available,
    results_start: results_start,
  });

  // 開始位置の変更を監視
  useEffect(() => {
    if (page.results_start === 1) return;

    const params = { start: page.results_start, keyword: keyword }; //検索結果の開始位置
    const query = new URLSearchParams(params);

    const request = async () => {
      const res = await fetch(`/api/search?${query}`); //APIのURLと検索ワードのkeywordは(quary)に含まれている
      const data = await res.json();
      const nextData = data.results;

      updatePage({
        results_available: nextData.results_available, //新しいクエリー条件にマッチする、検索結果の全件数
        results_start: nextData.results_start, //新しい検索結果の開始位置
      });

      if (nextData.results_start === 1) {
        updateShops(nextData.shop); //新しい検索結果の[複数要素]

        return;
      }
      updateShops((prev) => {
        return [...prev, ...nextData.shop]; //既存の配列に新しい検索結果の[複数要素]を足す
      });
    };
    request();
  }, [page.results_start]); //開始位置の変更が確認されるたびに

  // もっと読むボタンを押したときの処理
  const handlerOnClickReadMore = (e) => {
    // e.preventDefault();

    if (page.results_returned <= page.results_start) return; //このＸＭＬに含まれる検索結果の件数<=検索結果の開始位置

    updatePage((prev) => {
      return {
        ...prev,
        results_start: prev.results_start + 1,
      };
    });
  };
  // キーワードを格納
  const [keyword, setKeyword] = useState('');

  // キーワードの変更を監視
  useEffect(() => {
    if (keyword === '') return;
    console.log('updatePage');
    const params = { keyword: keyword };
    const query = new URLSearchParams(params);

    // リクエスト、レスポンスの取得
    const request = async () => {
      const res = await fetch(`/api/search?${query}`);
      const data = await res.json();
      const nextData = data.results;

      updatePage({
        results_available: nextData.results_available,
        results_start: nextData.results_start,
      });

      updateShops(nextData.shop);
    };

    request();
  }, [keyword]);

  // 検索ボタン押下時の処理
  const handlerOnSubmitSearch = (e) => {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === 'query');

    // keywordをセット
    const value = fieldQuery.value || '';
    setKeyword(value);
  };
  return (
    <>
      <Head>
        <title>東京グルメ店検索</title>
      </Head>
      <div className="max-w-3xl font-mono bg-gray-100 mx-auto">
        <div>
          <div className="text-2xl py-6 text-center">
            <h2 className="font-medium tracking-wider ">東京グルメ店検索</h2>
          </div>
          <div className="">
            <form onSubmit={handlerOnSubmitSearch} className="text-center">
              <input
                type="search"
                name="query"
                className="rounded py-2 px-4 text-left border-red-500"
                placeholder="キーワードを入力して下さい"
              />
              <button className="ml-2 text-white bg-red-500 rounded py-2 px-6 hover:opacity-75">
                Search
              </button>
            </form>
            <div className="text-sm pt-2 text-gray-600 text-center">
              <span>{page.results_available}</span> <span>件</span>
            </div>
          </div>
        </div>
        <ul className="mx-4">
          {shop.map((item, index) => {
            return (
              <li
                key={index}
                className="my-4 bg-white rounded border-red-500 border-2"
              >
                <Link href={item.urls.pc}>
                  {/* data.result.shop.item.urls.pc */}
                  {/* [複数要素].店舗URL.PC向けURL */}
                  <a>
                    <div className="grid grid-cols-10">
                      <div className="col-span-2 self-center">
                        <div>
                          <img src={item.photo.mobile.s} alt={item.name} />
                          {/* [複数要素].写真.携帯向け//[複数要素].掲載店名 */}
                        </div>
                      </div>
                      <div className="ml-3 col-span-8">
                        <div className="text-lg mt-2 mr-2">
                          {item.name}
                          {/* [複数要素].掲載店名 */}
                        </div>
                        <div className="text-xs mt-2 mr-2 pb-2">
                          <div className="text-xs">
                            <span className="font-medium">
                              {item.genre.name}
                            </span>
                            {/* [複数要素].お店ジャンル.お店ジャンル名 */}
                            <span className="ml-4">{item.catch}</span>
                            {/* [複数要素].お店キャッチ */}
                          </div>
                          <p className="mt-1"> {item.access}</p>
                          {/* [複数要素].交通アクセス */}
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            );
          })}
          {/* もっと読むボタンを画面下部に追加 */}
        </ul>
        {page.results_returned <= page.results_start ? (
          <div></div>
        ) : (
          <div className="text-center pt-4 pb-8">
            <button
              className="bg-red-500 rounded text-white tracking-wider font-medium hover:opacity-75 py-2 px-6 "
              onClick={handlerOnClickReadMore}
            >
              もっと読む
            </button>
          </div>
        )}
      </div>
    </>
  );
}
