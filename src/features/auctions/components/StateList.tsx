import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type StateMapShape = { id: string; name: string; d: string };

const StateList = ({
  states,
  countsByCode,
}: {
  states: StateMapShape[];
  countsByCode: Record<string, number>;
}) => {
  const router = useRouter();

  return (
    <section className="mt-2 xl:mt-10">
      <h2 className="text-base md:text-lg font-semibold mb-4">Browse by State</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
        {states.map((state) => {
          const count = countsByCode[state.id] ?? 0;

          return (
            <motion.div
              key={state.name}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-between text-sm py-2 px-2 rounded-md 
                       cursor-pointer select-none
                       hover:bg-muted/50"
              onClick={() => router.push(`/auctions/${state.name}`)}
            >
              <span className="text-foreground font-medium">
                {state.name}
              </span>
              <span className="text-muted-foreground">
                {count} {count === 1 ? "auction" : "auctions"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default StateList;
