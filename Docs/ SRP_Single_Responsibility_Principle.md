### **1. SRP как «0D-симплекс» (точка)**
**Суть SRP**:  
Каждый метод/класс должен решать **ровно одну задачу** (аналог точки в 0D — нет связей, только сама сущность).  

**Математическая интерпретация**:  
- **Метод** — это **вершина графа** (кружок).  
- Если метод соответствует SRP, то у него:  
  - **Одна входная стрелка** (вызов из одного места).  
  - **Одна выходная стрелка** (возврат результата или вызов **одного** другого SRP-метода).  

**Пример**:  
```python
# 0D-метод (SRP): выполняет только умножение.
def multiply(a, b):
    return a * b
```
Такой метод — атомарная «точка» в графе программы.

---

### **2. Композиция SRP-методов в «1D-симплексы» (последовательность)**
**Принцип**:  
Комбинируем SRP-методы в **линейные цепочки** (аналог отрезка в 1D — две вершины + одна связь).  

**Формально**:  
- Последовательность из `n` SRP-методов → **1D-симплекс** с `n+1` вершинами (включая начальный вызов).  
- Каждый метод передаёт результат следующему.  

**Пример**:  
```python
def calc_tax(price):
    return price * 0.2  # SRP

def format_price(price):
    return f"${price:.2f}"  # SRP

# 1D-симплекс (последовательность):
total = format_price(calc_tax(100))
```
Граф:  
```
[calc_tax] → [format_price]
```

---

### **3. Ветвление и циклы как «2D/3D-симплексы» с сохранением SRP**
**Правило**:  
Даже в сложных структурах (**ветвления/циклы**) каждый участник должен оставаться **0D- или 1D-симплексом**.  

#### a) **Ветвление (2D)**  
```python
def is_valid(user):  # SRP
    return user.age >= 18

def grant_access(user):  # SRP
    print("Access granted")

def deny_access(user):  # SRP
    print("Access denied")

# 2D-симплекс (треугольник):
if is_valid(user):  # → вершина 1
    grant_access(user)  # → вершина 2
else:
    deny_access(user)  # → вершина 3
```
Граф:  
```
  [is_valid]
   /      \
[grant] [deny]
```

#### b) **Цикл (3D)**  
```python
def should_continue(data):  # SRP
    return data.has_items()

def process_item(item):  # SRP
    print(f"Processing {item}")

# 3D-симплекс (тетраэдр с циклом):
while should_continue(data):  # → вершина 1
    item = data.next_item()   # → вершина 2
    process_item(item)        # → вершина 3
```
Граф:  
```
  [should_continue]
     /       ⟳
[next_item] → [process_item]
```

---

### **4. Контроль сложности через «размерность»**
Чем больше методов нарушают SRP, тем выше «размерность» графа программы → сложнее анализировать.  

**Пример нарушения SRP** (метод — «3D-симплекс»):  
```python
def process_order(order):  # Антипаттерн!
    if order.is_valid():          # ветвление
        for item in order.items:  # цикл
            item.process()        # действие
        order.notify()            # действие
    else:
        order.reject()            # действие
```
Проблемы:  
- Метод делает **валидацию, обработку, уведомление**.  
- Его граф — это **сложный многомерный симплекс** (тяжело тестировать и поддерживать).  

**Исправление через SRP**:  
```python
# 0D/1D-методы:
def validate(order): ...  # SRP
def process_items(items): ...  # SRP
def notify(user): ...  # SRP

# Композиция:
if validate(order):  # → 2D
    process_items(order.items)  # → 1D
    notify(order.user)  # → 1D
```

---

### **5. Математическая выгода SRP**
1. **Теорема декомпозиции**:  
   Любую программу можно представить как **комбинацию 0D/1D-симплексов** (SRP-методов) и управляющих структур (2D/3D).  

2. **Топологическая устойчивость**:  
   - Граф из SRP-методов **легко реконфигурировать** (замена вершины не ломает систему).  
   - Нарушение SRP добавляет «высокоразмерные» связи → граф становится хрупким.  

3. **Комбинаторика**:  
   Число возможных путей в графе растёт как **O(n^k)**, где:  
   - `n` — число методов,  
   - `k` — «размерность» (макс. сложность структуры).  
   SRP уменьшает `k` до 1-2 → упрощает анализ.  

---

### **6. Практическое правило**
**Формула SRP-симплекса**:  
> Если метод можно представить как **изолированную вершину** (0D) или **отрезок** (1D) в графе программы — он соответствует SRP. Иначе — требуется декомпозиция.

---

### **Итог**
- **SRP-методы** — это «атомы» программы (0D).  
- Их **композиции** образуют «молекулы» (1D/2D/3D симплексы).  
- Чем ниже «размерность» каждого метода, тем:  
  - Проще тестировать,  
  - Легче масштабировать,  
  - Надёжнее система.  

Это превращает проектирование в **геометрию управляемой сложности** — как сборку конструктора из стандартных блоков.  

[Сиплеккс](./Simplex.md)