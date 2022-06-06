import { Descendant, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

export type EmoteElement = {
  type: 'emote';
  id: string;
  children: Descendant[];
};

export type ParagraphElement = {
  type: 'paragraph';
  children: Descendant[];
};

export type CustomElement = ParagraphElement | EmoteElement;

export type CustomText = {
  text: string;
};

export type CustomEditor = BaseEditor & ReactEditor;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
