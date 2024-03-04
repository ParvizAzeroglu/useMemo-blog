import { faker } from "@faker-js/faker";

export const generateArticle = () => {
  return {
    header: faker.hacker.abbreviation(),
    text: faker.hacker.phrase(),
  };
};
