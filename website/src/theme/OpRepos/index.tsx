import useStoredJson from "@theme/useStoredJson";

const OpRepos = () => {
  const data = useStoredJson<
    {
      name: string;
      language: string;
      url: string;
    }[]
  >("op-repos");

  return (
    <ul>
      {data.map((repo) => (
        <li key={repo.name}>
          <a href={repo.url}>{repo.name}</a>
        </li>
      ))}
    </ul>
  );
};

export default OpRepos;
