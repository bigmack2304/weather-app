// двусвязный список, с возможностью автомотической сортировки

// варианты использования
// list = new sort_linked_list<тип значения хранимых данных. по умолчанию any>()
// 1. list.(1, "1")     - добавляем ноду(значение, вес), со значением и так все понятно а вес это
//                      - своиство ноды по которому ноды сортируются между собой (от меньшего к большему)
//                      - при добавляении ноды с уже имеющимся в структуре данных весом, новое значение перепишет значение ноды с такимже весом
// 2. list.(1)          - добавляется просто значение без веса, тогда ноды не сортируются и одинаковые значения не переписываются
//                      - при таком создании нод, find_by_weight работать не будет и сразу вернет undefined

// экземпляр класса
interface ISortLinkedList<V = any> {
    lenght: number;
    add(value: V, weight?: string): void;
    delete(index: number): void;
    at(need_index: number): TSortLinkedListNode | undefined;
    get_nodes_values(): Generator<unknown, V | undefined, unknown>;
    find_by_weight(findWeight: string): { node: TSortLinkedListNodeNoNull<V>; index: number } | undefined;
}

// тип ноды, возможно не существующей
type TSortLinkedListNode<V = any> = InstanceType<typeof _node<V>> | null;

// тип 100% существующей ноды
type TSortLinkedListNodeNoNull<V = any> = Exclude<TSortLinkedListNode<V>, null>;

const NON_WEIGHT = "--sort_linked_list > _node: NON_WEIGHT--";

function string_converter(str: string) {
    let temp = Number(str);
    if (isNaN(temp)) {
        return str;
    }
    return temp;
}

class _node<V = any> {
    public constructor(val: V, weight: string) {
        this.value = val;
        this.weight = weight;
    }

    public value: V; // значение ноды
    public weight: string = ""; // вес этой ноды, нужно для сортировки
    public next_node: TSortLinkedListNode<V> = null; // ссылка на следующую ноду
    public prev_node: TSortLinkedListNode<V> = null; // ссылка на предыдущую ноду
}

class sort_linked_list<NODE_VALUE = any> implements ISortLinkedList<NODE_VALUE> {
    public constructor() {}

    public lenght: number = 0;
    private _first_node: TSortLinkedListNode<NODE_VALUE> = null;
    private _isUseNoWeight = false;

    // добавляет новую ноду, так чтобы веса сортировались от меньшего к большему
    public add(value: NODE_VALUE, weight: string = NON_WEIGHT) {
        if (this.lenght === 0) {
            this._first_node = new _node<NODE_VALUE>(value, weight);
            this.lenght++;
        } else {
            let new_node = new _node(value, weight); // новая нода

            const add_last_no_sort = () => {
                this._isUseNoWeight = true;
                let last_node = this._get_last_node();

                if (last_node) {
                    last_node.next_node = new_node;
                    new_node.prev_node = last_node;
                } else {
                    this._first_node = new_node;
                }
                this.lenght++;
            };

            if (this._isUseNoWeight) {
                add_last_no_sort();
                return;
            }

            if (weight === NON_WEIGHT) {
                add_last_no_sort();
                return;
            } else {
                let list_place = this._find_to_add(weight)!;

                if (list_place.node_is == "EQUAL") {
                    list_place.node.value = new_node.value;
                    return;
                }

                if (list_place.node_is == "LESS") {
                    if (list_place.node.next_node) {
                        list_place.node.next_node.prev_node = new_node;
                        new_node.next_node = list_place.node.next_node;
                    }

                    list_place.node.next_node = new_node;
                    new_node.prev_node = list_place.node;
                    this.lenght++;

                    return;
                }

                if (list_place.node_is == "MORE") {
                    if (list_place.node.prev_node) {
                        list_place.node.prev_node.next_node = new_node;
                        new_node.prev_node = list_place.node.prev_node;
                    }

                    list_place.node.prev_node = new_node;
                    new_node.next_node = list_place.node;

                    this._first_node = this._get_first_node(new_node); // ??
                    this.lenght++;

                    return;
                }
            }
        }
    }

    // удаляет ноду по указанному индексу
    public delete(index: number) {
        let need_node = this.at(index);

        if (need_node == undefined) {
            throw new Error("node not found", { cause: { lenght: this.lenght, input_index: index } });
        }

        let before_node = need_node.prev_node;
        let after_node = need_node.next_node;

        if (before_node) {
            if (after_node) {
                before_node.next_node = after_node;
                after_node.prev_node = before_node;
            } else {
                before_node.next_node = null;
            }
        } else {
            if (after_node) {
                after_node.prev_node = null;
                this._first_node = after_node;
            } else {
                this._first_node = null;
            }
        }

        this.lenght--;
    }

    // возвращяет ноду по индексу
    public at(need_index: number) {
        if (this.lenght == 0) return undefined;
        if (need_index > this.lenght) return undefined;
        if (need_index < 0) return undefined;
        let node: TSortLinkedListNodeNoNull<NODE_VALUE>;

        // на этом этапе мы знаем что искомый номер ноды в пределах размера списка
        // поэтому пока мы движемся в цыкле у нас всегда будет node.next_node

        node = this._first_node!;

        for (let i = 0; i < this.lenght; i++) {
            if (i === need_index) {
                return node;
            }

            node = node.next_node!;
        }
    }

    // позволяет итерироватся по значениям нод, также можно использовать для преобразования этого списка в массив значений нод
    public *get_nodes_values(): Generator<unknown, NODE_VALUE | undefined, unknown> {
        if (this.lenght === 0) {
            return;
        }

        for (let i = 0; i < this.lenght; i++) {
            yield (this.at(i) as TSortLinkedListNodeNoNull<NODE_VALUE>).value;
        }
    }

    // ищет ноду по указанному весу
    // алгоритм двоичного поиска
    public find_by_weight(findWeightVal: string) {
        if (this.lenght === 0) return;
        if (this._isUseNoWeight === true) return;

        let start_index = 0; // храним индекс с которого начинаем поиск в половине
        let end_index = this.lenght - 1; // храним индекс которым заканчивается половина
        let current_index = Math.ceil(end_index / 2); // определяем центральный индекс
        let node: TSortLinkedListNodeNoNull<NODE_VALUE> = this.at(current_index)!; // получаем среднюю ноду

        let findWeight = string_converter(findWeightVal);
        let node_weight: string | number;
        while (true) {
            if (node == undefined || node.weight == undefined) {
                return; // не нашли
            }

            node_weight = string_converter(node.weight);

            if (end_index == current_index && node_weight !== findWeight) {
                return; // не нашли
            }

            if (node_weight === findWeight) {
                return { node: node, index: current_index };
            }

            if (node_weight > findWeight) {
                end_index = current_index;
                current_index = start_index + Math.ceil((end_index - start_index - 1) / 2);
                node = this.at(current_index)!;
                continue;
            }

            if (node_weight < findWeight) {
                start_index = current_index;
                current_index = start_index + Math.ceil((end_index - start_index) / 2);
                node = this.at(current_index)!;
            }
        }
    }

    private _get_first_node(anyNode: TSortLinkedListNodeNoNull<NODE_VALUE>) {
        let node = anyNode;

        while (node.prev_node !== null) {
            node = node.prev_node;
        }

        return node;
    }

    private _get_last_node() {
        if (this.lenght === 0) {
            return;
        }

        let node: TSortLinkedListNodeNoNull<NODE_VALUE> = this._first_node!;

        while (node.next_node) {
            node = node.next_node;
        }

        return node;
    }

    // ищет место для ноды по указанному весу, возвращает крайнюю ноду для этой позиции
    // также возвращает своиство, которое указывает, эта нода больше искомого веса, меньше или равна ?
    private _find_to_add(findWeightVal: string) {
        if (this.lenght === 0) return;
        if (this._isUseNoWeight === true) return;

        let checked_nodes = new WeakSet();
        let start_index = 0; // храним индекс с которого начинаем поиск в половине
        let end_index = this.lenght - 1; // храним индекс которым заканчивается половина
        let current_index = Math.ceil(end_index / 2); // определяем центральный индекс
        let temp_node: TSortLinkedListNodeNoNull<NODE_VALUE>;
        let node: TSortLinkedListNodeNoNull<NODE_VALUE> = this.at(current_index)!; // получаем среднюю ноду
        let find_state: "MORE" | "LESS" | "EQUAL" | null = null;

        let findWeight = string_converter(findWeightVal);
        let node_weight: string | number;

        while (true) {
            if (node == undefined || node.weight == undefined) {
                return { node: node, node_is: find_state };
            }

            node_weight = string_converter(node.weight);

            if (node_weight === findWeight) {
                checked_nodes.add(node);
                temp_node = node;
                find_state = "EQUAL";

                if (checked_nodes.has(node)) {
                    return { node: temp_node, node_is: find_state };
                }
            }

            if (node_weight > findWeight) {
                checked_nodes.add(node);
                find_state = "MORE";
                end_index = current_index;
                current_index = start_index + Math.ceil((end_index - start_index - 1) / 2);
                temp_node = node;
                node = this.at(current_index)!;

                if (checked_nodes.has(node)) {
                    return { node: temp_node, node_is: find_state };
                }

                continue;
            }

            if (node_weight < findWeight) {
                checked_nodes.add(node);
                find_state = "LESS";
                start_index = current_index;
                current_index = start_index + Math.ceil((end_index - start_index) / 2);
                temp_node = node;
                node = this.at(current_index)!;

                if (checked_nodes.has(node)) {
                    return { node: temp_node, node_is: find_state };
                }
            }
        }
    }

    // преобразует 2х связный список в односвязный и возвращает его в JSON строке
    public to_JSON() {
        let obj: any = {};
        let stack = [this._first_node];
        let selector = obj;

        while (stack.length !== 0) {
            let temp = stack.shift()!;

            for (let elem in temp) {
                if (elem == "prev_node") {
                    continue;
                }
                if (elem == "next_node") {
                    stack.push((temp as any)[elem]);
                    selector["next_node"] = (temp as any)[elem] ? {} : null;
                    continue;
                }
                selector[elem] = (temp as any)[elem];
            }

            if (selector["next_node"] !== null) {
                selector = selector["next_node"];
            }
        }

        return JSON.stringify(obj);
    }

    [Symbol.toPrimitive](hint: "string" | "number" | "default") {
        if (hint == "string") {
            return "[link_list object]";
        } else if (hint == "number") {
            return this.lenght;
        }

        return this._first_node;
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////
// let list = new sort_linked_list();

// let time1 = performance.now();
// for (let i = 1000; i > 0; i--) {
//     list.add(i, `${i}`);
// }
// let time2 = performance.now();

// console.log("test list", time2 - time1);

// ////////////////////////////////////////////////////////////////////////////////////////

// let arr = [];

// let time3 = performance.now();
// for (let i = 1000; i > 0; i--) {
//     arr.push(i);
//     arr.sort((a: number, b: number) => {
//         if (a > b) return 1;
//         if (a < b) return -1;
//         return 0;
//     });
// }
// let time4 = performance.now();
// console.log("test array", time4 - time3);

// ////////////////////////////////////////////////////////////////////////////////////////

export { sort_linked_list };
export type { ISortLinkedList };
