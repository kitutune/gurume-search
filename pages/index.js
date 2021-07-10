import Head from 'next/head';
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
  console.log(data.results);
  return <></>;
}
