import { pageValidator } from "@/utils/validators";
import UserComponent from "@/web/components/UserComponent"; // Assume this is a component you create to display user info
import Pagination from "@/web/components/ui/Pagination";
import config from "@/web/config";
import { readResource } from "@/web/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: pageValidator.validateSync(page),
  },
});

const UsersPage = (props) => {
  const { page } = props;
  const {
    isLoading,
    data: { data: { result: users, meta: { count } = {} } = {} } = {},
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => readResource("users", { params: { page } }),
  });
  const countPages = Math.ceil(count / config.pagination.limit);

  if (isLoading || !users) {
    return <div className="text-center p-32 animate-bounce">Loading...</div>;
  }

  return (
    <div className="py-4 flex flex-col gap-16">
      <ul className="flex flex-col gap-8">
        {users.map((user) => (
          <li key={user.id}>
            <UserComponent {...user} /> {/* Display user details */}
          </li>
        ))}
      </ul>
      <Pagination pathname="/users" page={page} countPages={countPages} />
    </div>
  );
};

export default UsersPage;
