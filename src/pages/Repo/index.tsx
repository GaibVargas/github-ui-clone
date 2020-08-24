import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Container, Breadcrumb, RepoIcon, Stats, StarIcon, ForkIcon, LinkButton, GithubIcon } from './styles';

import { APIRepo } from '../../@types';

interface Data {
  repo?: APIRepo;
  error?: string;
}

const Repo: React.FC = () => {
  const { username, reponame } = useParams();
  const [repoData, setRepoData] = useState<Data>();

  useEffect(() => {
    fetch(`https://api.github.com/repos/${username}/${reponame}`)
      .then(async response => {
        if(response.status === 404) {
          setRepoData({ error: 'Repo not found' });
          return;
        }

        const repo = await response.json();
        setRepoData({ repo });
      });
  }, [username, reponame]);

  if(repoData?.error) {
    return <h1>{repoData.error}</h1>
  }

  if(!repoData?.repo) {
    return <h1>Loading...</h1>
  }

  return (
    <Container>
      <Breadcrumb>
        <RepoIcon />
        <Link className="username" to={`/${repoData.repo.owner.login}`}>
          {repoData.repo.owner.login}
        </Link>

        <span>/</span>

        <Link className="reponame" to={`/${repoData.repo.owner.login}/${repoData.repo.name}`}>
          {repoData.repo.name}
        </Link>
      </Breadcrumb>

      {repoData.repo.description && (
        <p>{repoData.repo.description}</p>
      )}

      <Stats>
        <li>
          <StarIcon />
          <b>{repoData.repo.stargazers_count}</b>
          <span>stars</span>
        </li>
        <li>
          <ForkIcon />
          <b>{repoData.repo.forks}</b>
          <span>forks</span>
        </li>
      </Stats>

      <LinkButton href={`https://github.com/${repoData.repo.owner.login}/${repoData.repo.name}`}>
        <GithubIcon />
        <span>View on Github</span>
      </LinkButton>
    </Container>
  );
}

export default Repo;