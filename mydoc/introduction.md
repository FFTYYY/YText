---
name: 1. Introduction
---

# Introduction

I believe articles are not barely texts, nor visual elements. 
Although our language is linear, words come one after another, we humen's mind is far from linear, 
structures, branching, moods exist therein.
Therefore I build __YText__, a text editor library that decouples the abstract structure and concrete visualization of an article.

YText is composed of three major components:
- Editor, which allows one to edit the structure of an article without specifying how to render it.
- Printer, which allows one to define how to render the abatract representation of an article (say into a web page).
- Concept System, which is shared by editor and printer, defining how to represent an article by the abstract representation.

The so called "abstract representation" 
(terminology wise I call it  __intermediate representation__, since the word "abstract" is used in another situation) 
of an article is organized as a tree 
(a json tree in implementation), whose nodes are concepts or trivial nodes. 

## About "Realization"

Sometimes I use the word "realization", it is analogous to the term with the same name in OOP programing. 
In YText, some times an element provides a name and a group of _parameter prototype_, 
and another element specify a name and _values of paramater_, which is of the same type with the coresponding parameter prototype. 
In this case, I say the latter elements realizes the former element. 

Notice that in YText, element names (or together with some other properties, like class), serves as the unique indicator of an element, 
which is like class name in OOP. The parameter prototype does not only defines how a parameter would be, 
but also serves as the default value of the parameters which can be used when coresponding term is not specified and can be overrided.

# The Grammar of Intermediate Representation

As mentioned before, the intermediate representation in YText is a tree. Therefore two types of non-leaf nodes in this tree: 
1. Concept nodes, and
2. Paragraph nodes,

and leaf nodes are all called text nodes. A text node is basically a string, which corresponding to a phrase in the article. 
A paragraph node is a list of text nodes and inline concept nodes (will explain later), which corresponding to a paragraph in the article.

## Concept & Concept nodes

Each concept node belongs to a concept, which is specified by user, and it also provodes a group of parameters which _realizes_ the concept. 
Each __concept__ should specifies four properties:
1. The concept type, which is in {"group", "structure", "inline", "support", "abstract"}, which defines which kind of concept the concept is.
2. The parameter prototype of this concept.
3. The values of meta parameters. Meta -parameters are specified by YText.
3. The values of inherent parameters. Inherent are specified by YText.
4. The rendering method which takes concept parameter realization as input and defines how to render this concept into a visual element.

### Concept Types

Concept types are pre-defined in YText. There are five concept types: group, structure, inline, support and abstract. 
Each concept type defines specifies a group of parameter prototype, which is called the inherent parameters of this concept type. 
Each concept type also defines a local grammar, namely what type of nodes can its children be. 
The detailed definition of each type will be discussed later, but here I breifly explain each type, to give you a intuiation about each type.
1. A __group__ node is a list of paragrahs, which is it self be seen as a whole. 
For examples a theorem in a mathmatics paper can be viewed as a group node. The `\item` element in LateX can also be viewed as a group.
Group nodes can form series, in which the group nodes comes one after the other (I call this __chaining__), 
for example the `enumerate` environment in LateX. 
A proof comes right after a theorem in a mathmatics paper is also an example of chaining group nodes.
2. A __structure__ node consists of several Group nodes. 
A structure node should be rendered in a a different direction of the ordinary direction of the document. 
If the document is rendered from top to bottom, then a structure node renders from left to right. One line in a table is an example.
3. An __inline__ node is of the same position of text nodes, but with styles. The `<strong>` tag in HTML is an example.
4. A __support__ node is a visual element that does not contain text contents 
(or more generally, can only contain an empty text node as its child). 
Support nodes are the non-text visual elements in an article. For example figures, images, table lines. 
It can even be non-visualable to printer and just serve as an aid to editor. 
5. An __abstract__ node is simply the root node of a tree. 
The word "abstract" comes from a machanism in YText which allows an article fissions into several in the middle, 
which we will dicuss detailly later.

### Meta Parameters

YText specified meta parameter prototype, which should be realized by every concept node. There are three values to be specified:
1. force-block: If we force an element (mainly inline or support) to be rendered as a block in HTML.
2. force-inline: If we force an element (mainly group, structure or support) to be rendered as an inline element in HTML.
3. force-void: If we force an element to be uneditable (which is like support nodes).

### First Class Concepts and Second Class Concepts

As wise readers might have noticed, each concept node have two types of properties: 
those for defining intermediate trees and those for specifying how a node to rendered.
Theoretically this might not be a problem, but technically, if a user of YText might not be the user of the editor: 
User A might use YText to develop a library, providing an implementation of the printer and editor, 
and provided it to user B who defines concepts and use them to write articles. Here problems occurs: 
when a library author leave users the freedom of defining their own concepts, 
they don't mean to let users write js code to define how to render the concept nodes. 
Therefore, the rendering part and the structure defining part of a concept must be splitted.
To this end, each concept in YText is composed of two parts, I call them first class concepts and second class concepts.

A first class concept, which should be provided by the library developer, 
specifies the concept type, a parameter prototype and the render function. 
A second class concept, which should be provided by the terminal user, 
specifies a first class concept and another parameter prototype 
and the _rule to convert second class parameters into first class parameters_.

Generally speaking, a first class concept should be universal enough which has several "slots" and agnostic to second class concepts. 
The second class concept fill in those slots by inidcating first class parameters.

## Abstract

Each concept node has another property "abstract", which is a list of abstract nodes (can be empty). 
As mentioned before, abstract nodes are roots of an intermediate tree. 
Therefore, the "abstract" property allows us to write a new article which ties at the current node.

The use of abstract can be quite flexible. For example, it can be used to write footnotes and sidenotes 
(the way of rendering it is up to our implementation). 
It can also be used to fold too long or not important contents, like the proof of a theorem in a mathmatics paper, 
a supplementary figure, or a comment that breaks the coherency wherever it is placed in the main text.

Notice that absract defines a new article, that has no difference with the original one, which means it can be as complecated, 
and the elements therein can also have abstracts. This mechanism allows a quite complex structure of an article, like a net. 
The structure of an article needs no longer to be linear. An article can be fissioned at the half and each goes to a complete article.

## Implementation

To use YText, a user need to specify three components: the implementation of editor, the implementation of printer, 
and the definition of concepts. However, a user might not want to write an editor from their own. 
To this end, YText provides a default implementation of editor and printer, 
for those who don't care about the implementation of editors and printers.

The decomposing of editor, printer and concepts also means every component can be used in a plugin manner. 
A user can use the editor of imeplementation A of YText, and use printer of imeplementation B of YText, 
and define their own concepts. 
They can even combine different imeplementations, 
like using just a small component of imeplementation A and other parts of imeplementation B. 

