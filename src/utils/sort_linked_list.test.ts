import { sort_linked_list } from "./sort_linked_list";
import type { ISortLinkedList } from "./sort_linked_list";

describe("test sort_linked_list.ts", () => {
    let list: ISortLinkedList<number>;

    beforeEach(() => {
        list = new sort_linked_list<number>();
    });

    test("test length", () => {
        list.add(1);
        list.add(1);
        list.add(2);
        list.add(3);
        expect(list.lenght).toEqual(4);

        list.delete(0);
        expect(list.lenght).toEqual(3);
    });

    test("test add (no sort)", () => {
        list.add(4);
        list.add(2);
        list.add(2);
        list.add(6);
        expect([...list.get_nodes_values()]).toEqual([4, 2, 2, 6]);

        list.add(1);
        expect([...list.get_nodes_values()]).toEqual([4, 2, 2, 6, 1]);
    });

    test("test add (sort)", () => {
        list.add(4, "4");
        list.add(2, "2");
        list.add(2, "2");
        list.add(6, "6");
        expect([...list.get_nodes_values()]).toEqual([2, 4, 6]);

        list.add(1, "1");
        expect([...list.get_nodes_values()]).toEqual([1, 2, 4, 6]);
    });

    test("test delete", () => {
        list.add(4);
        list.add(2);
        list.add(2);
        list.add(6);
        list.delete(0);
        expect([...list.get_nodes_values()]).toEqual([2, 2, 6]);
        list.delete(2);
        expect([...list.get_nodes_values()]).toEqual([2, 2]);

        try {
            list.delete(10);
        } catch (e) {
            expect((e as Error).message).toBe("node not found");
        }

        list.delete(1);
        expect([...list.get_nodes_values()]).toEqual([2]);

        list.delete(0);
        expect([...list.get_nodes_values()]).toEqual([]);
    });

    test("test at", () => {
        list.add(4);
        list.add(1);
        list.add(2);
        list.add(6);

        expect(list.at(0)!.value).toEqual(4);
        expect(list.at(1)!.value).toEqual(1);
        expect(list.at(3)!.value).toEqual(6);

        expect(list.at(12)).toEqual(undefined);
    });

    test("test get_nodes_values", () => {
        list.add(4);
        list.add(1);
        list.add(2);
        list.add(6);

        let values = list.get_nodes_values();

        expect(values.next().value).toEqual(4);
        expect(values.next().value).toEqual(1);
        expect(values.next().value).toEqual(2);
        expect(values.next().value).toEqual(6);
        expect(values.next().value).toEqual(undefined);

        expect([...list.get_nodes_values()]).toEqual([4, 1, 2, 6]);
    });

    test("find_by_weight", () => {
        list.add(4, "4");
        list.add(1, "1");
        list.add(2, "2");
        list.add(6, "6");

        expect(list.find_by_weight("2")!.index).toEqual(1);
        expect(list.find_by_weight("2")!.node.value).toEqual(2);
        expect(list.find_by_weight("6")!.index).toEqual(3);
        expect(list.find_by_weight("6")!.node.value).toEqual(6);

        // несуществующий вес
        expect(list.find_by_weight("7")).toEqual(undefined);
        expect(list.find_by_weight("3")).toEqual(undefined);
        expect(list.find_by_weight("0")).toEqual(undefined);

        // этот поиск работает только в отсортированном массиве
        list = new sort_linked_list<number>();
        list.add(4);
        list.add(1);
        list.add(2);
        list.add(6);

        expect(list.find_by_weight("6")).toEqual(undefined);
    });
});
