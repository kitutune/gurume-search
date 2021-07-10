import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

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
  console.log(data.results.shop);
  return (
    <>
      <Head>
        <title>東京グルメ店検索</title>
      </Head>
      <div className="max-w-3xl font-mono bg-gray-100 mx-auto">
        <ul className="mx-4">
          {data.results.shop.map((item, index) => {
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
        </ul>
      </div>
    </>
  );
}
